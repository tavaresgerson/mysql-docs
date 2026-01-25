### 13.1.8 Instrução ALTER TABLE

[13.1.8.1 Operações de Particionamento ALTER TABLE](alter-table-partition-operations.html)

[13.1.8.2 ALTER TABLE e Colunas Geradas](alter-table-generated-columns.html)

[13.1.8.3 Exemplos de ALTER TABLE](alter-table-examples.html)

```sql
ALTER TABLE tbl_name
    [alter_option [, alter_option] ...]
    [partition_options]

alter_option: {
    table_options
  | ADD [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ADD [COLUMN] (col_name column_definition,...)
  | ADD {INDEX | KEY} [index_name]
        [index_type] (key_part,...) [index_option] ...
  | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
        (key_part,...) [index_option] ...
  | ADD [CONSTRAINT [symbol PRIMARY KEY
        [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol UNIQUE [INDEX | KEY]
        [index_name] [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol FOREIGN KEY
        [index_name] (col_name,...)
        reference_definition
  | ADD CHECK (expr)
  | ALGORITHM [=] {DEFAULT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | DROP DEFAULT
    }
  | CHANGE [COLUMN] old_col_name new_col_name column_definition
        [FIRST | AFTER col_name]
  | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
  | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
  | {DISABLE | ENABLE} KEYS
  | {DISCARD | IMPORT} TABLESPACE
  | DROP [COLUMN] col_name
  | DROP {INDEX | KEY} index_name
  | DROP PRIMARY KEY
  | DROP FOREIGN KEY fk_symbol
  | FORCE
  | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
  | MODIFY [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ORDER BY col_name [, col_name] ...
  | RENAME {INDEX | KEY} old_index_name TO new_index_name
  | RENAME [TO | AS] new_tbl_name
  | {WITHOUT | WITH} VALIDATION
}

partition_options:
    partition_option [partition_option] ...

partition_option: {
    ADD PARTITION (partition_definition)
  | DROP PARTITION partition_names
  | DISCARD PARTITION {partition_names | ALL} TABLESPACE
  | IMPORT PARTITION {partition_names | ALL} TABLESPACE
  | TRUNCATE PARTITION {partition_names | ALL}
  | COALESCE PARTITION number
  | REORGANIZE PARTITION partition_names INTO (partition_definitions)
  | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
  | ANALYZE PARTITION {partition_names | ALL}
  | CHECK PARTITION {partition_names | ALL}
  | OPTIMIZE PARTITION {partition_names | ALL}
  | REBUILD PARTITION {partition_names | ALL}
  | REPAIR PARTITION {partition_names | ALL}
  | REMOVE PARTITIONING
  | UPGRADE PARTITIONING
}

key_part:
    col_name [(length)] [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

table_options:
    table_option ,] table_option] ...

table_option: {
    AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    (see CREATE TABLE options)
```

A instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") altera a estrutura de uma tabela. Por exemplo, você pode adicionar ou excluir colunas, criar ou destruir Indexes, alterar o tipo de colunas existentes ou renomear colunas ou a própria tabela. Você também pode alterar características como o storage engine usado para a tabela ou o comentário da tabela.

* Para usar [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), você precisa dos privilégios [`ALTER`](privileges-provided.html#priv_alter), [`CREATE`](privileges-provided.html#priv_create) e [`INSERT`](privileges-provided.html#priv_insert) para a tabela. Renomear uma tabela requer [`ALTER`](privileges-provided.html#priv_alter) e [`DROP`](privileges-provided.html#priv_drop) na tabela antiga, e [`ALTER`](privileges-provided.html#priv_alter), [`CREATE`](privileges-provided.html#priv_create) e [`INSERT`](privileges-provided.html#priv_insert) na nova tabela.

* Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for fornecida, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") não fará nada.

* A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Cláusulas *`column_definition`* utilizam a mesma sintaxe para `ADD` e `CHANGE` que para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Para mais informações, consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement").

* A palavra `COLUMN` é opcional e pode ser omitida.

* Múltiplas cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única instrução [`ALTER TABLE`], separadas por vírgulas. Esta é uma extensão MySQL ao SQL padrão, que permite apenas uma de cada cláusula por instrução [`ALTER TABLE`]. Por exemplo, para remover múltiplas colunas em uma única instrução, faça o seguinte:

  ```sql
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* Se um storage engine não suportar uma operação [`ALTER TABLE`] tentada, um aviso pode ser emitido. Tais avisos podem ser exibidos com [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). Consulte [Seção 13.7.5.40, “Instrução SHOW WARNINGS”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). Para obter informações sobre a solução de problemas de [`ALTER TABLE`], consulte [Seção B.3.6.1, “Problemas com ALTER TABLE”](alter-table-problems.html "B.3.6.1 Problemas com ALTER TABLE").

* Para obter informações sobre colunas geradas, consulte [Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”](alter-table-generated-columns.html "13.1.8.2 ALTER TABLE and Generated Columns").

* Para exemplos de uso, consulte [Seção 13.1.8.3, “Exemplos de ALTER TABLE”](alter-table-examples.html "13.1.8.3 ALTER TABLE Examples").

* Com a função C API [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html), você pode descobrir quantas linhas foram copiadas por [`ALTER TABLE`]. Consulte [mysql_info()](/doc/c-api/5.7/en/mysql-info.html).

Existem vários aspectos adicionais da instrução `ALTER TABLE`, descritos nos seguintes tópicos desta seção:

* [Opções de Tabela](alter-table.html#alter-table-options "Table Options")
* [Desempenho e Requisitos de Espaço](alter-table.html#alter-table-performance "Performance and Space Requirements")
* [Controle de Concorrência](alter-table.html#alter-table-concurrency "Concurrency Control")
* [Adicionando e Removendo Colunas](alter-table.html#alter-table-add-drop-column "Adding and Dropping Columns")
* [Renomeando, Redefinindo e Reordenando Colunas](alter-table.html#alter-table-redefine-column "Renaming, Redefining, and Reordering Columns")
* [Primary Keys e Indexes](alter-table.html#alter-table-index "Primary Keys and Indexes")
* [Foreign Keys e Outras Constraints](alter-table.html#alter-table-foreign-key "Foreign Keys and Other Constraints")
* [Alterando o Conjunto de Caracteres](alter-table.html#alter-table-character-set "Changing the Character Set")
* [Descartando e Importando Tablespaces InnoDB](alter-table.html#alter-table-discard-import "Discarding and Importing InnoDB Tablespaces")
* [Ordem de Linhas para Tabelas MyISAM](alter-table.html#alter-table-row-order "Row Order for MyISAM Tables")
* [Opções de Particionamento](alter-table.html#alter-table-partition-options "Partitioning Options")

#### Opções de Tabela

*`table_options`* significa opções de tabela do tipo que podem ser usadas na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), como `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT` ou `TABLESPACE`.

Para descrições de todas as opções de tabela, consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement"). No entanto, [`ALTER TABLE`] ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. [`ALTER TABLE`] os permite apenas como opções de particionamento e, a partir do MySQL 5.7.17, exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com [`ALTER TABLE`] fornece uma maneira conveniente de alterar características de uma única tabela. Por exemplo:

* Se `t1` não for atualmente uma tabela `InnoDB`, esta instrução altera seu storage engine para `InnoDB`:

  ```sql
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  + Consulte [Seção 14.6.1.5, “Convertendo Tabelas de MyISAM para InnoDB”](converting-tables-to-innodb.html "14.6.1.5 Converting Tables from MyISAM to InnoDB") para considerações ao mudar tabelas para o storage engine `InnoDB`.

  + Quando você especifica uma cláusula `ENGINE`, [`ALTER TABLE`] reconstrói a tabela. Isso é verdade mesmo que a tabela já utilize o storage engine especificado.

  + Executar [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela `InnoDB` existente executa uma operação [`ALTER TABLE`] “nula”, que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito na [Seção 14.12.4, “Desfragmentando uma Tabela”](innodb-file-defragmenting.html "14.12.4 Defragmenting a Table"). Executar [`ALTER TABLE tbl_name FORCE`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela `InnoDB` executa a mesma função.

  + [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`ALTER TABLE tbl_name FORCE`](alter-table.html "13.1.8 ALTER TABLE Statement") usam [online DDL](innodb-online-ddl.html "14.13 InnoDB and Online DDL"). Para mais informações, consulte [Seção 14.13, “InnoDB e Online DDL”](innodb-online-ddl.html "14.13 InnoDB and Online DDL").

  + O resultado da tentativa de alterar o storage engine de uma tabela é afetado pelo fato de o storage engine desejado estar disponível e pela configuração do modo SQL [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution), conforme descrito na [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Server SQL Modes").

  + Para evitar a perda não intencional de dados, [`ALTER TABLE`] não pode ser usado para alterar o storage engine de uma tabela para `MERGE` ou `BLACKHOLE`.

* Para alterar a tabela `InnoDB` para usar o formato de armazenamento de linha compactado:

  ```sql
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* Para habilitar ou desabilitar a encryption para uma tabela `InnoDB` em um tablespace [file-per-table]:

  ```sql
  ALTER TABLE t1 ENCRYPTION='Y';
  ALTER TABLE t1 ENCRYPTION='N';
  ```

  Um plugin de keyring deve ser instalado e configurado para usar a opção `ENCRYPTION`. Para mais informações, consulte [Seção 14.14, “Criptografia de Dados em Repouso InnoDB”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption").

  A opção `ENCRYPTION` é suportada apenas pelo storage engine `InnoDB`; portanto, funciona apenas se a tabela já usar `InnoDB` (e você não alterar o storage engine da tabela), ou se a instrução `ALTER TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a instrução é rejeitada com [`ER_CHECK_NOT_IMPLEMENTED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_check_not_implemented).

* Para redefinir o valor atual do auto-increment:

  ```sql
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

  Você não pode redefinir o contador para um valor menor ou igual ao valor que está em uso atualmente. Tanto para `InnoDB` quanto para `MyISAM`, se o valor for menor ou igual ao valor máximo atual na coluna `AUTO_INCREMENT`, o valor será redefinido para o valor máximo atual da coluna `AUTO_INCREMENT` mais um.

* Para alterar o conjunto de caracteres (character set) Default da tabela:

  ```sql
  ALTER TABLE t1 CHARACTER SET = utf8;
  ```

  Consulte também [Alterando o Conjunto de Caracteres](alter-table.html#alter-table-character-set "Changing the Character Set").

* Para adicionar (ou alterar) um comentário de tabela:

  ```sql
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` com a opção `TABLESPACE` para mover tabelas `InnoDB` entre [general tablespaces](glossary.html#glos_general_tablespace "general tablespace") existentes, tablespaces [file-per-table](glossary.html#glos_file_per_table "file-per-table") e o [system tablespace](glossary.html#glos_system_tablespace "system tablespace"). Consulte [Movendo Tabelas entre Tablespaces Usando ALTER TABLE](general-tablespaces.html#general-tablespaces-moving-non-partitioned-tables "Moving Tables Between Tablespaces Using ALTER TABLE").

  + Operações `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

  + A sintaxe `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um tablespace temporário para um tablespace persistente.

  + A cláusula `DATA DIRECTORY`, que é suportada com [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement"), não é suportada com `ALTER TABLE ... TABLESPACE` e é ignorada se especificada.

  + Para mais informações sobre as capacidades e limitações da opção `TABLESPACE`, consulte [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

* O MySQL NDB Cluster 7.5.2 e posterior suporta a definição de opções `NDB_TABLE` para controlar o balanceamento de Partition de uma tabela (tipo de contagem de fragmentos), capacidade de leitura de qualquer réplica, replicação completa ou qualquer combinação destes, como parte do comentário da tabela para uma instrução `ALTER TABLE` da mesma maneira que para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), conforme mostrado neste exemplo:

  ```sql
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  Também é possível definir opções `NDB_COMMENT` para colunas de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como parte de uma instrução `ALTER TABLE`, como esta:

  ```sql
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=MAX_BLOB_PART_SIZE';
  ```

  Lembre-se de que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte [Definindo opções NDB_TABLE](create-table.html#create-table-comment-ndb-table-options "Setting NDB_TABLE options"), para informações e exemplos adicionais.

Para verificar se as opções de tabela foram alteradas conforme o esperado, use [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") ou consulte a tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") do Information Schema.

#### Desempenho e Requisitos de Espaço

As operações [`ALTER TABLE`] são processadas usando um dos seguintes algoritmos:

* `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova tabela linha por linha. DML concorrente não é permitido.

* `INPLACE`: As operações evitam copiar dados da tabela, mas podem reconstruir a tabela no local (in place). Um Lock exclusivo de metadados na tabela pode ser adquirido brevemente durante as fases de preparação e execução da operação. Tipicamente, DML concorrente é suportado.

Para tabelas que usam o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), esses algoritmos funcionam da seguinte forma:

* `COPY`: O `NDB` cria uma cópia da tabela e a altera; o handler do NDB Cluster então copia os dados entre as versões antiga e nova da tabela. Posteriormente, o `NDB` exclui a tabela antiga e renomeia a nova.

  Isso às vezes também é referido como um `ALTER TABLE` de "cópia" (copying) ou "offline".

* `INPLACE`: Os nós de dados fazem as alterações necessárias; o handler do NDB Cluster não copia dados nem participa de outra forma.

  Isso às vezes também é referido como um `ALTER TABLE` de "não-cópia" (non-copying) ou "online".

Consulte [Seção 21.6.12, “Operações Online com ALTER TABLE no NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), para mais informações.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INPLACE` para os storage engines e cláusulas [`ALTER TABLE`] que a suportam. Caso contrário, `ALGORITHM=COPY` é usado.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para as cláusulas e storage engines que o suportam, ou falhe com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula `ALGORITHM`.

As operações [`ALTER TABLE`] que usam o algoritmo `COPY` esperam que outras operações que estejam modificando a tabela sejam concluídas. Depois que as alterações são aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação [`ALTER TABLE`] é executada, a tabela original é legível por outras sessões (com a exceção mencionada em breve). Updates e escritas (writes) na tabela iniciados após o início da operação [`ALTER TABLE`] são paralisadas até que a nova tabela esteja pronta e, em seguida, são automaticamente redirecionados para a nova tabela. A cópia temporária da tabela é criada no diretório Database da tabela original, a menos que seja uma operação `RENAME TO` que mova a tabela para um Database que resida em um diretório diferente.

A exceção mencionada anteriormente é que [`ALTER TABLE`] bloqueia leituras (não apenas escritas) no ponto em que está pronto para instalar uma nova versão do arquivo `.frm` da tabela, descartar o arquivo antigo e limpar estruturas de tabela desatualizadas do cache de tabela e de definição de tabela. Neste ponto, ele deve adquirir um Lock exclusivo. Para fazer isso, espera que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação [`ALTER TABLE`] que usa o algoritmo `COPY` impede operações DML concorrentes. Queries concorrentes ainda são permitidas. Ou seja, uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permite Queries, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK`, especificando `LOCK=EXCLUSIVE`, que impede DML e Queries. Para mais informações, consulte [Controle de Concorrência](alter-table.html#alter-table-concurrency "Concurrency Control").

Para forçar o uso do algoritmo `COPY` para uma operação [`ALTER TABLE`] que de outra forma não o usaria, habilite a variável de sistema [`old_alter_table`](server-system-variables.html#sysvar_old_alter_table) ou especifique `ALGORITHM=COPY`. Se houver um conflito entre a configuração `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` terá precedência.

Para tabelas `InnoDB`, uma operação [`ALTER TABLE`] que usa o algoritmo `COPY` em uma tabela que reside em um [shared tablespace](glossary.html#glos_shared_tablespace "shared tablespace") pode aumentar a quantidade de espaço usado pelo tablespace. Tais operações exigem tanto espaço adicional quanto os dados na tabela mais os Indexes. Para uma tabela residente em um shared tablespace, o espaço adicional usado durante a operação não é liberado de volta para o sistema operacional, como acontece com uma tabela que reside em um tablespace [file-per-table](glossary.html#glos_file_per_table "file-per-table").

Para obter informações sobre os requisitos de espaço para operações online DDL, consulte [Seção 14.13.3, “Requisitos de Espaço Online DDL”](innodb-online-ddl-space-requirements.html "14.13.3 Online DDL Space Requirements").

As operações [`ALTER TABLE`] que suportam o algoritmo `INPLACE` incluem:

* Operações `ALTER TABLE` suportadas pelo recurso [online DDL](glossary.html#glos_online_ddl "online DDL") do `InnoDB`. Consulte [Seção 14.13.1, “Operações Online DDL”](innodb-online-ddl-operations.html "14.13.1 Online DDL Operations").

* Renomear uma tabela. O MySQL renomeia arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") para renomear tabelas. Consulte [Seção 13.1.33, “Instrução RENAME TABLE”](rename-table.html "13.1.33 RENAME TABLE Statement").) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

* Operações que apenas modificam metadados da tabela. Essas operações são imediatas porque o servidor apenas altera o arquivo `.frm` da tabela, sem tocar no conteúdo da tabela. As operações somente de metadados incluem:

  + Renomear uma coluna.
  + Alterar o valor Default de uma coluna (exceto para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")).

  + Modificar a definição de uma coluna [`ENUM`](enum.html "11.3.5 The ENUM Type") ou [`SET`](set.html "11.3.6 The SET Type") adicionando novos membros de enumeração ou set ao *final* da lista de valores de membros válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna [`SET`](set.html "11.3.6 The SET Type") que tem 8 membros muda o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

* Renomear um Index.
* Adicionar ou remover (drop) um Index secundário, para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Consulte [Seção 14.13, “InnoDB e Online DDL”](innodb-online-ddl.html "14.13 InnoDB and Online DDL").

* Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), operações que adicionam e removem Indexes em colunas de largura variável. Essas operações ocorrem online, sem cópia de tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Consulte [Seção 21.6.12, “Operações Online com ALTER TABLE no NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), para mais informações.

[`ALTER TABLE`] atualiza colunas temporais do MySQL 5.5 para o formato 5.6 para operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser feita usando o algoritmo `INPLACE` porque a tabela deve ser reconstruída, então especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um Index de múltiplas colunas usado para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só poderá ser executada usando `ALGORITHM=COPY`.

As cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION` afetam se [`ALTER TABLE`] executa uma operação in-place para modificações de [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column"). Consulte [Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”](alter-table-generated-columns.html "13.1.8.2 ALTER TABLE and Generated Columns").

O NDB Cluster anteriormente suportava operações `ALTER TABLE` online usando as palavras-chave `ONLINE` e `OFFLINE`. Essas palavras-chave não são mais suportadas; seu uso causa um erro de sintaxe. O MySQL NDB Cluster 7.5 (e posterior) suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o MySQL Server padrão. O `NDB` não suporta a alteração de um tablespace online. Consulte [Seção 21.6.12, “Operações Online com ALTER TABLE no NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), para mais informações.

`ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria nenhuma tabela temporária ou arquivos de Partition temporários.

`ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usado com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")); no entanto, essas operações podem e criam arquivos de Partition temporários.

As operações `ADD` ou `DROP` para Partitions `RANGE` ou `LIST` são operações imediatas ou quase isso. As operações `ADD` ou `COALESCE` para Partitions `HASH` ou `KEY` copiam dados entre todas as Partitions, a menos que `LINEAR HASH` ou `LINEAR KEY` tenha sido usado; isso é efetivamente o mesmo que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada Partition por Partition. As operações `REORGANIZE` copiam apenas Partitions alteradas e não tocam nas inalteradas.

Para tabelas `MyISAM`, você pode acelerar a recriação do Index (a parte mais lenta do processo de alteração) definindo a variável de sistema [`myisam_sort_buffer_size`](server-system-variables.html#sysvar_myisam_sort_buffer_size) para um valor alto.

#### Controle de Concorrência

Para operações [`ALTER TABLE`] que o suportam, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não Default para esta cláusula permite que você exija uma certa quantidade de acesso concorrente ou exclusividade durante a operação de alteração e interrompe a operação se o grau de Lock solicitado não estiver disponível. Os parâmetros para a cláusula `LOCK` são:

* `LOCK = DEFAULT`

  Nível máximo de concorrência para a cláusula `ALGORITHM` fornecida (se houver) e operação `ALTER TABLE`: Permite leituras e escritas concorrentes se suportado. Caso contrário, permite leituras concorrentes se suportado. Caso contrário, impõe acesso exclusivo.

* `LOCK = NONE`

  Se suportado, permite leituras e escritas concorrentes. Caso contrário, ocorre um erro.

* `LOCK = SHARED`

  Se suportado, permite leituras concorrentes, mas bloqueia escritas (writes). As escritas são bloqueadas mesmo se escritas concorrentes forem suportadas pelo storage engine para a cláusula `ALGORITHM` fornecida (se houver) e operação `ALTER TABLE`. Se leituras concorrentes não forem suportadas, ocorre um erro.

* `LOCK = EXCLUSIVE`

  Impõe acesso exclusivo. Isso é feito mesmo se leituras/escritas concorrentes forem suportadas pelo storage engine para a cláusula `ALGORITHM` fornecida (se houver) e operação `ALTER TABLE`.

#### Adicionando e Removendo Colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão MySQL ao SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma linha da tabela, use `FIRST` ou `AFTER col_name`. O Default é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser removida. Se o que você pretende é remover a tabela, use a instrução [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement").

Se colunas forem removidas de uma tabela, as colunas também serão removidas de qualquer Index do qual façam parte. Se todas as colunas que compõem um Index forem removidas, o Index também será removido.

#### Renomeando, Redefinindo e Reordenando Colunas

As cláusulas `CHANGE`, `MODIFY` e `ALTER` permitem que os nomes e definições de colunas existentes sejam alterados. Elas têm as seguintes características comparativas:

* `CHANGE`:

  + Pode renomear uma coluna e alterar sua definição, ou ambos.
  + Tem mais capacidade do que `MODIFY`, mas à custa da conveniência para algumas operações. `CHANGE` requer nomear a coluna duas vezes se não a estiver renomeando.

  + Com `FIRST` ou `AFTER`, pode reordenar colunas.

* `MODIFY`:

  + Pode alterar uma definição de coluna, mas não o seu nome.
  + Mais conveniente que `CHANGE` para alterar uma definição de coluna sem renomeá-la.

  + Com `FIRST` ou `AFTER`, pode reordenar colunas.

* `ALTER`: Usado apenas para alterar o valor Default de uma coluna.

`CHANGE` é uma extensão MySQL ao SQL padrão. `MODIFY` é uma extensão MySQL para compatibilidade com Oracle.

Para alterar uma coluna para mudar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigo e novo e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT`, mantendo o atributo `NOT NULL`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar uma definição de coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe exige dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para deixar o nome inalterado. Por exemplo, para alterar a definição da coluna `b`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` é mais conveniente para alterar a definição sem alterar o nome, pois requer o nome da coluna apenas uma vez:

```sql
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `CHANGE`. A sintaxe requer uma definição de coluna, então para deixar a definição inalterada, você deve especificar novamente a definição que a coluna possui atualmente. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

Para alterações de definição de coluna usando `CHANGE` ou `MODIFY`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, além dos atributos de Index, como `PRIMARY KEY` ou `UNIQUE`. Atributos presentes na definição original, mas não especificados para a nova definição, não são mantidos. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` e você modifique a coluna da seguinte forma, pretendendo alterar apenas `INT` para `BIGINT`:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa instrução altera o tipo de dados de `INT` para `BIGINT`, mas também remove os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a instrução deve incluí-los explicitamente:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para alterações de tipo de dados usando `CHANGE` ou `MODIFY`, o MySQL tenta converter os valores de coluna existentes para o novo tipo da melhor forma possível.

Aviso

Esta conversão pode resultar em alteração de dados. Por exemplo, se você encurtar uma coluna de string, os valores podem ser truncados. Para evitar que a operação seja bem-sucedida se as conversões para o novo tipo de dados resultarem em perda de dados, habilite o modo SQL estrito antes de usar [`ALTER TABLE`] (consulte [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Server SQL Modes")).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual um Index existe, e o comprimento da coluna resultante for menor que o comprimento do Index, o MySQL encurta o Index automaticamente.

Para colunas renomeadas por `CHANGE`, o MySQL renomeia automaticamente estas referências para a coluna renomeada:

* Indexes que fazem referência à coluna antiga, incluindo Indexes e Indexes `MyISAM` desabilitados.

* Foreign Keys que fazem referência à coluna antiga.

Para colunas renomeadas por `CHANGE`, o MySQL não renomeia automaticamente estas referências para a coluna renomeada:

* Expressões de coluna gerada e de Partition que fazem referência à coluna renomeada. Você deve usar `CHANGE` para redefinir tais expressões na mesma instrução [`ALTER TABLE`] que renomeia a coluna.

* Views e stored programs que fazem referência à coluna renomeada. Você deve alterar manualmente a definição desses objetos para fazer referência ao novo nome da coluna.

Para reordenar colunas dentro de uma tabela, use `FIRST` e `AFTER` nas operações `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especificam um novo valor Default para uma coluna ou removem o valor Default antigo, respectivamente. Se o Default antigo for removido e a coluna puder ser `NULL`, o novo Default será `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor Default conforme descrito na [Seção 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values").

`ALTER ... SET DEFAULT` não pode ser usado com a função [`CURRENT_TIMESTAMP`](date-and-time-functions.html#function_current-timestamp).

#### Primary Keys e Indexes

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos storage engines `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [symbol FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. Consulte [Seção 1.6.3.2, “Constraints FOREIGN KEY”](constraint-foreign-key.html "1.6.3.2 FOREIGN KEY Constraints"). Para outros storage engines, as cláusulas são analisadas (parsed), mas ignoradas.

A cláusula de Constraint `CHECK` é analisada, mas ignorada por todos os storage engines. Consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement"). O motivo para aceitar, mas ignorar, cláusulas de sintaxe é a compatibilidade, para facilitar a portabilidade de código de outros servidores SQL e para executar aplicações que criam tabelas com referências. Consulte [Seção 1.6.2, “Diferenças do MySQL em Relação ao SQL Padrão”](differences-from-ansi.html "1.6.2 MySQL Differences from Standard SQL").

Para [`ALTER TABLE`], diferentemente de [`CREATE TABLE`], `ADD FOREIGN KEY` ignora *`index_name`* se fornecido e usa um nome de foreign key gerado automaticamente. Como alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da foreign key:

```sql
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações `REFERENCES` inline, onde as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas cláusulas `REFERENCES` definidas como parte de uma especificação `FOREIGN KEY` separada.

Nota

Tabelas `InnoDB` particionadas não suportam foreign keys. Esta restrição não se aplica a tabelas `NDB`, incluindo aquelas particionadas explicitamente por `[LINEAR] KEY`. Para mais informações, consulte [Seção 22.6.2, “Limitações de Particionamento Relacionadas a Storage Engines”](partitioning-limitations-storage-engines.html "22.6.2 Partitioning Limitations Relating to Storage Engines").

O MySQL Server e o NDB Cluster suportam o uso de [`ALTER TABLE`] para remover foreign keys:

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Adicionar e remover uma foreign key na mesma instrução [`ALTER TABLE`] é suportado para [`ALTER TABLE ... ALGORITHM=INPLACE`] mas não para [`ALTER TABLE ... ALGORITHM=COPY`].

O servidor proíbe alterações em colunas de foreign key que tenham o potencial de causar perda de integridade referencial. Uma alternativa é usar [`ALTER TABLE ... DROP FOREIGN KEY`] antes de alterar a definição da coluna e [`ALTER TABLE ... ADD FOREIGN KEY`] depois. Exemplos de alterações proibidas incluem:

* Alterações no tipo de dados de colunas de foreign key que possam ser inseguras. Por exemplo, alterar [`VARCHAR(20)`](char.html "11.3.2 The CHAR and VARCHAR Types") para [`VARCHAR(30)`](char.html "11.3.2 The CHAR and VARCHAR Types") é permitido, mas alterá-lo para [`VARCHAR(1024)`](char.html "11.3.2 The CHAR and VARCHAR Types") não é, porque isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

* Alterar uma coluna `NULL` para `NOT NULL` no modo não estrito é proibido para evitar a conversão de valores `NULL` em valores Default não-`NULL`, para os quais não há valores correspondentes na tabela referenciada. A operação é permitida no modo estrito, mas um erro é retornado se tal conversão for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera nomes de Constraint de foreign key gerados internamente e nomes de Constraint de foreign key definidos pelo usuário que começam com a string “*`tbl_name`*_ibfk_” para refletir o novo nome da tabela. O `InnoDB` interpreta nomes de Constraint de foreign key que começam com a string “*`tbl_name`*_ibfk_” como nomes gerados internamente.

#### Alterando o Conjunto de Caracteres

Para alterar o conjunto de caracteres Default da tabela e todas as colunas de caracteres ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) para um novo conjunto de caracteres, use uma instrução como esta:

```sql
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A instrução também altera o collation de todas as colunas de caracteres. Se você não especificar uma cláusula `COLLATE` para indicar qual collation usar, a instrução usará o collation Default para o conjunto de caracteres. Se este collation for inapropriado para o uso pretendido da tabela (por exemplo, se mudaria de um collation case-sensitive para um collation case-insensitive), especifique um collation explicitamente.

Para uma coluna que tenha um tipo de dados [`VARCHAR`] ou um dos tipos [`TEXT`], `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna seja longa o suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna [`TEXT`] tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna [`TEXT`] `latin1`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8`, cada caractere pode exigir até três bytes, para um comprimento máximo possível de 3 × 65.535 = 196.605 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna [`TEXT`], então o MySQL converte o tipo de dados para [`MEDIUMTEXT`], que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 196.605. Da mesma forma, uma coluna [`VARCHAR`] pode ser convertida para [`MEDIUMTEXT`].

Para evitar alterações de tipo de dados do tipo acabado de descrever, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```sql
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas [`CHAR`], [`VARCHAR`] e [`TEXT`] serão convertidas para seus tipos de string binária correspondentes ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Isso significa que as colunas não terão mais um conjunto de caracteres e uma operação `CONVERT TO` subsequente não se aplicará a elas.

Se *`charset_name`* for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema [`character_set_database`](server-system-variables.html#sysvar_character_set_database) será usado.

Aviso

A operação `CONVERT TO` converte valores de coluna entre o conjunto de caracteres original e o nomeado. Isso *não* é o que você deseja se tiver uma coluna em um conjunto de caracteres (como `latin1`), mas os valores armazenados realmente usam algum outro conjunto de caracteres incompatível (como `utf8`). Neste caso, você deve fazer o seguinte para cada coluna:

```sql
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou de colunas [`BLOB`].

Para alterar apenas o conjunto de caracteres *Default* para uma tabela, use esta instrução:

```sql
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres Default é o conjunto de caracteres usado se você não especificar o conjunto de caracteres para colunas que adicionar posteriormente a uma tabela (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) está habilitada, que é a configuração Default, a conversão de conjunto de caracteres não é permitida em tabelas que incluem uma coluna de string de caracteres usada em uma Constraint de foreign key. A solução é desabilitar [`foreign_key_checks`] antes de realizar a conversão do conjunto de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na Constraint de foreign key antes de reabilitar [`foreign_key_checks`]. Se você reabilitar [`foreign_key_checks`] após converter apenas uma das tabelas, uma operação `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper dados na tabela de referência devido à conversão implícita que ocorre durante essas operações (Bug #45290, Bug #74816).

#### Descartando e Importando Tablespaces InnoDB

Uma tabela `InnoDB` criada em seu próprio tablespace [file-per-table](glossary.html#glos_file_per_table "file-per-table") pode ser importada de um backup ou de outra instância do MySQL Server usando as cláusulas `DISCARD TABLESPACE` e `IMPORT TABLESPACE`. Consulte [Seção 14.6.1.3, “Importando Tabelas InnoDB”](innodb-table-import.html "14.6.1.3 Importing InnoDB Tables").

#### Ordem de Linhas para Tabelas MyISAM

`ORDER BY` permite que você crie a nova tabela com as linhas em uma ordem específica. Esta opção é útil principalmente quando você sabe que consultará as linhas em uma determinada ordem na maioria das vezes. Ao usar esta opção após grandes alterações na tabela, você pode obter um desempenho superior. Em alguns casos, isso pode facilitar a classificação para o MySQL se a tabela estiver em ordem pela coluna pela qual você deseja ordená-la posteriormente.

Nota

A tabela não permanece na ordem especificada após inserções (inserts) e exclusões (deletes).

A sintaxe `ORDER BY` permite que um ou mais nomes de colunas sejam especificados para classificação, cada um dos quais opcionalmente pode ser seguido por `ASC` ou `DESC` para indicar ordem de classificação ascendente ou descendente, respectivamente. O Default é ordem ascendente. Apenas nomes de colunas são permitidos como critérios de classificação; expressões arbitrárias não são permitidas. Esta cláusula deve ser fornecida por último, após quaisquer outras cláusulas.

`ORDER BY` não faz sentido para tabelas `InnoDB`, pois o `InnoDB` sempre ordena as linhas da tabela de acordo com o [clustered index](glossary.html#glos_clustered_index "clustered index").

Quando usado em uma tabela particionada, `ALTER TABLE ... ORDER BY` ordena as linhas apenas dentro de cada Partition.

#### Opções de Particionamento

*`partition_options`* significa opções que podem ser usadas com tabelas particionadas para repartitioning, para adicionar, remover (drop), descartar, importar, mesclar e dividir Partitions, e para realizar manutenção de Partitions.

É possível que uma instrução [`ALTER TABLE`] contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` além de outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último, após quaisquer outras especificações. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, pois as opções listadas agem em Partitions individuais.

Para obter mais informações sobre opções de Partitions, consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement") e [Seção 13.1.8.1, “Operações de Particionamento ALTER TABLE”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). Para obter informações e exemplos de instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte [Seção 22.3.3, “Trocando Partitions e Subpartitions com Tabelas”](partitioning-management-exchange.html "22.3.3 Exchanging Partitions and Subpartitions with Tables").

Antes do MySQL 5.7.6, tabelas `InnoDB` particionadas usavam o manipulador de Partitions genérico `ha_partition` empregado por MyISAM e outros storage engines que não forneciam seus próprios manipuladores de Partitions; no MySQL 5.7.6 e posterior, essas tabelas são criadas usando o manipulador de Partitions próprio (ou "nativo") do storage engine `InnoDB`. A partir do MySQL 5.7.9, você pode atualizar uma tabela `InnoDB` que foi criada no MySQL 5.7.6 ou anterior (ou seja, criada usando `ha_partition`) para o manipulador de Partition nativo do `InnoDB` usando `ALTER TABLE ... UPGRADE PARTITIONING`. (Bug #76734, Bug #20727344) Esta sintaxe `ALTER TABLE` não aceita outras opções e só pode ser usada em uma única tabela por vez. Você também pode usar [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") no MySQL 5.7.9 ou posterior para atualizar tabelas **InnoDB** particionadas mais antigas para o manipulador de Partitions nativo.