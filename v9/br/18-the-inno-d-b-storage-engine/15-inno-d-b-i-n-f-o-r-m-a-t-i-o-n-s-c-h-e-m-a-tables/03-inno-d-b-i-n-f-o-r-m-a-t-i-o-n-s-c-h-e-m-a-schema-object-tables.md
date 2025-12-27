### 17.15.3 Tabelas de Objetos do Esquema do `InnoDB` do `INFORMATION_SCHEMA`

Você pode extrair metadados sobre os objetos do esquema gerenciados pelo `InnoDB` usando as tabelas do `INFORMATION_SCHEMA` do `InnoDB`. Essas informações vêm do dicionário de dados. Tradicionalmente, você obteria esse tipo de informação usando as técnicas da Seção 17.17, “Monitoramento do `InnoDB’”, configurando monitores do `InnoDB` e analisando a saída da instrução `SHOW ENGINE INNODB STATUS`. A interface da tabela `InnoDB` do `INFORMATION_SCHEMA` permite que você faça consultas a esses dados usando SQL.

As tabelas de objetos do esquema do `InnoDB` do `INFORMATION_SCHEMA` incluem as tabelas listadas aqui:

* `INNODB_DATAFILES`
* `INNODB_TABLESTATS`
* `INNODB_FOREIGN`
* `INNODB_COLUMNS`
* `INNODB_INDEXES`
* `INNODB_FIELDS`
* `INNODB_TABLESPACES`
* `INNODB_TABLESPACES_BRIEF`
* `INNODB_FOREIGN_COLS`
* `INNODB_TABLES`

Os nomes das tabelas são indicativos do tipo de dados fornecidos:

* `INNODB_TABLES` fornece metadados sobre as tabelas do `InnoDB`.

* `INNODB_COLUMNS` fornece metadados sobre as colunas das tabelas do `InnoDB`.

* `INNODB_INDEXES` fornece metadados sobre os índices do `InnoDB`.

* `INNODB_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices do `InnoDB`.

* `INNODB_TABLESTATS` fornece uma visão de informações de status de nível baixo sobre as tabelas do `InnoDB` que são derivadas de estruturas de dados em memória.

* `INNODB_DATAFILES` fornece informações sobre o caminho dos arquivos de dados para os espaços de tabelas por arquivo do `InnoDB` e espaços de tabelas gerais.

* `INNODB_TABLESPACES` fornece metadados sobre os espaços de tabelas do `InnoDB` por arquivo, gerais e de undo.

* `INNODB_TABLESPACES_BRIEF` fornece um subconjunto de metadados sobre os espaços de tabelas do `InnoDB`.

* `INNODB_FOREIGN` fornece metadados sobre as chaves estrangeiras definidas nas tabelas do `InnoDB`.

* `INNODB_FOREIGN_COLS` fornece metadados sobre as colunas de chaves estrangeiras definidas em tabelas `InnoDB`.

As tabelas do esquema `INFORMATION_SCHEMA` de `InnoDB` podem ser unidas por meio de campos como `TABLE_ID`, `INDEX_ID` e `SPACE`, permitindo que você recupere facilmente todos os dados disponíveis para um objeto que você deseja estudar ou monitorar.

Consulte a documentação do esquema `INFORMATION_SCHEMA` de `InnoDB` para obter informações sobre as colunas de cada tabela.

**Exemplo 17.2 Tabelas de Objetos do Esquema `INFORMATION_SCHEMA` de `InnoDB`**

Este exemplo usa uma tabela simples (`t1`) com um único índice (`i1`) para demonstrar o tipo de metadados encontrados nas tabelas de objeto do esquema `INFORMATION_SCHEMA` de `InnoDB`.

1. Crie um banco de dados de teste e uma tabela `t1`:

   ```
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. Após criar a tabela `t1`, execute a consulta `INNODB_TABLES` para localizar os metadados para `test/t1`:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
    INSTANT_COLS: 0
   ```

   A tabela `t1` tem um `TABLE_ID` de 71. O campo `FLAG` fornece informações em nível de bits sobre o formato da tabela e as características de armazenamento. Existem seis colunas, das quais três são colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O ID da `SPACE` da tabela é 57 (um valor de 0 indicaria que a tabela reside no espaço de tabelas do sistema). O `ROW_FORMAT` é Compact. `ZIP_PAGE_SIZE` só se aplica a tabelas com um formato de linha `Compressed`. `INSTANT_COLS` mostra o número de colunas na tabela antes de adicionar a primeira coluna instantânea usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`.

3. Usando as informações do `TABLE_ID` da consulta `INNODB_TABLES`, execute a consulta da tabela `INNODB_COLUMNS` para obter informações sobre as colunas da tabela.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_COLUMNS where TABLE_ID = 71\G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: col1
             POS: 0
           MTYPE: 6
          PRTYPE: 1027
             LEN: 4
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 2. row ***************************
        TABLE_ID: 71
            NAME: col2
             POS: 1
           MTYPE: 2
          PRTYPE: 524542
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 3. row ***************************
        TABLE_ID: 71
            NAME: col3
             POS: 2
           MTYPE: 1
          PRTYPE: 524303
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   ```orkI4ydi5X```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE TABLE_ID = 71 \G
   *************************** 1. row ***************************
          INDEX_ID: 111
              NAME: GEN_CLUST_INDEX
          TABLE_ID: 71
              TYPE: 1
          N_FIELDS: 0
           PAGE_NO: 3
             SPACE: 57
   MERGE_THRESHOLD: 50
   *************************** 2. row ***************************
          INDEX_ID: 112
              NAME: i1
          TABLE_ID: 71
              TYPE: 0
          N_FIELDS: 1
           PAGE_NO: 4
             SPACE: 57
   MERGE_THRESHOLD: 50
   ```MgqCv3BNbf```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```gUxHjqZAOE```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
             SPACE: 57
             NAME: test/t1
             FLAG: 16417
       ROW_FORMAT: Dynamic
        PAGE_SIZE: 16384
    ZIP_PAGE_SIZE: 0
       SPACE_TYPE: Single
    FS_BLOCK_SIZE: 4096
        FILE_SIZE: 114688
   ALLOCATED_SIZE: 98304
   AUTOEXTEND_SIZE: 0
   SERVER_VERSION: 8.4.0
    SPACE_VERSION: 1
       ENCRYPTION: N
            STATE: normal
   ```tMeoakNhnq```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```ntvrLF2ZzG```
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESTATS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
            TABLE_ID: 71
                NAME: test/t1
   STATS_INITIALIZED: Initialized
            NUM_ROWS: 1
    CLUST_INDEX_SIZE: 1
    OTHER_INDEX_SIZE: 0
    MODIFIED_COUNTER: 1
             AUTOINC: 0
           REF_COUNT: 1
   ```lMP81oXMAk```
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE parent (id INT NOT NULL,
          PRIMARY KEY (id)) ENGINE=INNODB;

   mysql> CREATE TABLE child (id INT, parent_id INT,
       ->     INDEX par_ind (parent_id),
       ->     CONSTRAINT fk1
       ->     FOREIGN KEY (parent_id) REFERENCES parent(id)
       ->     ON DELETE CASCADE) ENGINE=INNODB;
   ```Dgydci1c0i```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```BKJWIcLByH```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```jJyiPbWHPj```