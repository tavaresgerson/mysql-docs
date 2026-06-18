### 14.16.3 Tabelas de Sistema INFORMATION_SCHEMA do InnoDB

Você pode extrair metadados sobre objetos de schema gerenciados pelo `InnoDB` usando as tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB`. Esta informação provém das tabelas de sistema internas do `InnoDB` (também referidas como o dicionário de dados do `InnoDB`), que não podem ser consultadas diretamente como tabelas `InnoDB` regulares. Tradicionalmente, você obteria esse tipo de informação usando as técnicas da Seção 14.18, “Monitores InnoDB”, configurando monitores `InnoDB` e analisando a saída da instrução `SHOW ENGINE INNODB STATUS`. A interface das tabelas `INFORMATION_SCHEMA` do `InnoDB` permite que você consulte esses dados usando SQL.

Com exceção de `INNODB_SYS_TABLESTATS`, para a qual não há tabela de sistema interna correspondente, as tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB` são preenchidas com dados lidos diretamente das tabelas de sistema internas do `InnoDB`, em vez de metadados que estão em cache na memória.

As tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB` incluem as tabelas listadas abaixo.

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_SYS%';
+--------------------------------------------+
| Tables_in_information_schema (INNODB_SYS%) |
+--------------------------------------------+
| INNODB_SYS_DATAFILES                       |
| INNODB_SYS_TABLESTATS                      |
| INNODB_SYS_FOREIGN                         |
| INNODB_SYS_COLUMNS                         |
| INNODB_SYS_INDEXES                         |
| INNODB_SYS_FIELDS                          |
| INNODB_SYS_TABLESPACES                     |
| INNODB_SYS_FOREIGN_COLS                    |
| INNODB_SYS_TABLES                          |
+--------------------------------------------+
```

Os nomes das tabelas indicam o tipo de dado fornecido:

* `INNODB_SYS_TABLES` fornece metadados sobre tabelas `InnoDB`, equivalente à informação na tabela `SYS_TABLES` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_COLUMNS` fornece metadados sobre colunas de tabelas `InnoDB`, equivalente à informação na tabela `SYS_COLUMNS` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_INDEXES` fornece metadados sobre Indexes `InnoDB`, equivalente à informação na tabela `SYS_INDEXES` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_FIELDS` fornece metadados sobre as colunas chave (fields) de Indexes `InnoDB`, equivalente à informação na tabela `SYS_FIELDS` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_TABLESTATS` fornece uma visão de informações de status de baixo nível sobre tabelas `InnoDB` que são derivadas de estruturas de dados na memória. Não há tabela de sistema `InnoDB` interna correspondente.

* `INNODB_SYS_DATAFILES` fornece informações de path de arquivo de dados para tablespaces file-per-table e gerais do `InnoDB`, equivalente a informações na tabela `SYS_DATAFILES` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_TABLESPACES` fornece metadados sobre tablespaces file-per-table e gerais do `InnoDB`, equivalente à informação na tabela `SYS_TABLESPACES` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_FOREIGN` fornece metadados sobre chaves estrangeiras (`Foreign Keys`) definidas em tabelas `InnoDB`, equivalente à informação na tabela `SYS_FOREIGN` no dicionário de dados do `InnoDB`.

* `INNODB_SYS_FOREIGN_COLS` fornece metadados sobre as colunas de chaves estrangeiras que são definidas em tabelas `InnoDB`, equivalente à informação na tabela `SYS_FOREIGN_COLS` no dicionário de dados do `InnoDB`.

As tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB` podem ser unidas (JOIN) através de campos como `TABLE_ID`, `INDEX_ID` e `SPACE`, permitindo que você recupere facilmente todos os dados disponíveis para um objeto que você deseja estudar ou monitorar.

Consulte a documentação do `INFORMATION_SCHEMA` do `InnoDB` para obter informações sobre as colunas de cada tabela.

**Exemplo 14.2 Tabelas de Sistema INFORMATION_SCHEMA do InnoDB**

Este exemplo utiliza uma tabela simples (`t1`) com um único Index (`i1`) para demonstrar o tipo de metadados encontrados nas tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB`.

1. Crie um Database de teste e a tabela `t1`:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. Após criar a tabela `t1`, consulte `INNODB_SYS_TABLES` para localizar os metadados para `test/t1`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
   ...
   ```

   A tabela `t1` tem um `TABLE_ID` de 71. O campo `FLAG` fornece informações em nível de bit sobre o formato da tabela e as características de armazenamento. Existem seis colunas, três das quais são colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O ID do `SPACE` da tabela é 57 (um valor de 0 indicaria que a tabela reside no system tablespace). O `FILE_FORMAT` é Antelope, e o `ROW_FORMAT` é Compact. `ZIP_PAGE_SIZE` se aplica apenas a tabelas com um `row format` Compactado (`Compressed`).

3. Usando a informação de `TABLE_ID` de `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_COLUMNS` para obter informações sobre as colunas da tabela.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
   TABLE_ID: 71
       NAME: col1
        POS: 0
      MTYPE: 6
     PRTYPE: 1027
        LEN: 4
   *************************** 2. row ***************************
   TABLE_ID: 71
       NAME: col2
        POS: 1
      MTYPE: 2
     PRTYPE: 524542
        LEN: 10
   *************************** 3. row ***************************
   TABLE_ID: 71
       NAME: col3
        POS: 2
      MTYPE: 1
     PRTYPE: 524303
        LEN: 10
   ```

   Além do `TABLE_ID` e do `NAME` da coluna, `INNODB_SYS_COLUMNS` fornece a posição ordinal (`POS`) de cada coluna (começando em 0 e incrementando sequencialmente), o `MTYPE` da coluna ou "tipo principal" (6 = INT, 2 = CHAR, 1 = VARCHAR), o `PRTYPE` ou "tipo preciso" (um valor binário com bits que representam o tipo de dados MySQL, código de conjunto de caracteres e nulidade), e o comprimento da coluna (`LEN`).

4. Usando a informação de `TABLE_ID` de `INNODB_SYS_TABLES` mais uma vez, consulte `INNODB_SYS_INDEXES` para obter informações sobre os Indexes associados à tabela `t1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 71 \G
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
   ```

   `INNODB_SYS_INDEXES` retorna dados para dois Indexes. O primeiro Index é `GEN_CLUST_INDEX`, que é um Clustered Index criado pelo `InnoDB` se a tabela não tiver um Clustered Index definido pelo usuário. O segundo Index (`i1`) é o Secondary Index definido pelo usuário.

   O `INDEX_ID` é um identificador para o Index que é único em todos os Databases em uma instância. O `TABLE_ID` identifica a tabela à qual o Index está associado. O valor `TYPE` do Index indica o tipo de Index (1 = Clustered Index, 0 = Secondary Index). O valor `N_FILEDS` é o número de fields que compõem o Index. `PAGE_NO` é o número da página root da B-tree do Index, e `SPACE` é o ID do tablespace onde o Index reside. Um valor diferente de zero indica que o Index não reside no system tablespace. `MERGE_THRESHOLD` define um valor de limite percentual para a quantidade de dados em uma página de Index. Se a quantidade de dados em uma página de Index cair abaixo desse valor (o padrão é 50%) quando uma linha é deletada ou quando uma linha é encurtada por uma operação de update, o `InnoDB` tenta fazer o merge da página de Index com uma página de Index vizinha.

5. Usando a informação de `INDEX_ID` de `INNODB_SYS_INDEXES`, consulte `INNODB_SYS_FIELDS` para obter informações sobre os fields do Index `i1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_SYS_FIELDS` fornece o `NAME` do field indexado e sua posição ordinal dentro do Index. Se o Index (i1) tivesse sido definido em vários fields, `INNODB_SYS_FIELDS` forneceria metadados para cada um dos fields indexados.

6. Usando a informação de `SPACE` de `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_TABLESPACES` para obter informações sobre o tablespace da tabela.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
           SPACE: 57
            NAME: test/t1
            FLAG: 0
     FILE_FORMAT: Antelope
      ROW_FORMAT: Compact or Redundant
       PAGE_SIZE: 16384
   ZIP_PAGE_SIZE: 0
   ```

   Além do ID `SPACE` do tablespace e do `NAME` da tabela associada, `INNODB_SYS_TABLESPACES` fornece dados `FLAG` do tablespace, que são informações em nível de bit sobre o formato do tablespace e características de armazenamento. Também são fornecidos o `FILE_FORMAT`, `ROW_FORMAT`, `PAGE_SIZE` do tablespace e vários outros itens de metadados do tablespace.

7. Usando a informação de `SPACE` de `INNODB_SYS_TABLES` mais uma vez, consulte `INNODB_SYS_DATAFILES` para a localização do arquivo de dados do tablespace.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   O datafile está localizado no diretório `test` sob o diretório `data` do MySQL. Se um tablespace file-per-table fosse criado em um local fora do diretório de dados do MySQL usando a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE`, o `PATH` do tablespace seria um caminho de diretório totalmente qualificado.

8. Como etapa final, insira uma linha na tabela `t1` (`TABLE_ID = 71`) e visualize os dados na tabela `INNODB_SYS_TABLESTATS`. Os dados nesta tabela são usados pelo Optimizer do MySQL para calcular qual Index usar ao consultar uma tabela `InnoDB`. Esta informação é derivada de estruturas de dados na memória. Não há tabela de sistema `InnoDB` interna correspondente.

   ```sql
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71 \G
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
   ```

   O campo `STATS_INITIALIZED` indica se as estatísticas foram coletadas para a tabela. `NUM_ROWS` é o número estimado atual de linhas na tabela. Os campos `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE` relatam o número de páginas em disco que armazenam Indexes clusterizados e secundários para a tabela, respectivamente. O valor `MODIFIED_COUNTER` mostra o número de linhas modificadas por operações DML e operações cascade de chaves estrangeiras. O valor `AUTOINC` é o próximo número a ser emitido para qualquer operação baseada em autoincremento. Não há colunas de autoincremento definidas na tabela `t1`, portanto, o valor é 0. O valor `REF_COUNT` é um contador. Quando o contador atinge 0, significa que os metadados da tabela podem ser despejados do table cache.

**Exemplo 14.3 Tabelas de Sistema INFORMATION_SCHEMA de Chave Estrangeira**

As tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS` fornecem dados sobre relacionamentos de chave estrangeira (`Foreign Key`). Este exemplo usa uma tabela pai (`parent`) e uma tabela filha (`child`) com um relacionamento de chave estrangeira para demonstrar os dados encontrados nas tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`.

1. Crie o Database de teste com tabelas pai e filha:

   ```sql
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE parent (id INT NOT NULL,
          PRIMARY KEY (id)) ENGINE=INNODB;

   mysql> CREATE TABLE child (id INT, parent_id INT,
          INDEX par_ind (parent_id),
          CONSTRAINT fk1
          FOREIGN KEY (parent_id) REFERENCES parent(id)
          ON DELETE CASCADE) ENGINE=INNODB;
   ```

2. Após a criação das tabelas pai e filha, consulte `INNODB_SYS_FOREIGN` e localize os dados da chave estrangeira para o relacionamento de chave estrangeira `test/child` e `test/parent`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Os metadados incluem o `ID` da chave estrangeira (`fk1`), que é o nome do `CONSTRAINT` que foi definido na tabela filha. O `FOR_NAME` é o nome da tabela filha onde a chave estrangeira está definida. `REF_NAME` é o nome da tabela pai (a tabela "referenciada"). `N_COLS` é o número de colunas no Index da chave estrangeira. `TYPE` é um valor numérico que representa bit flags que fornecem informações adicionais sobre a coluna da chave estrangeira. Neste caso, o valor `TYPE` é 1, o que indica que a opção `ON DELETE CASCADE` foi especificada para a chave estrangeira. Consulte a definição da tabela `INNODB_SYS_FOREIGN` para obter mais informações sobre os valores `TYPE`.

3. Usando o `ID` da chave estrangeira, consulte `INNODB_SYS_FOREIGN_COLS` para visualizar dados sobre as colunas da chave estrangeira.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` é o nome da coluna de chave estrangeira na tabela filha, e `REF_COL_NAME` é o nome da coluna referenciada na tabela pai. O valor `POS` é a posição ordinal do key field dentro do Index da chave estrangeira, começando em zero.

**Exemplo 14.4 Realizando JOIN em Tabelas de Sistema INFORMATION_SCHEMA do InnoDB**

Este exemplo demonstra como realizar JOIN em três tabelas de sistema `INFORMATION_SCHEMA` do `InnoDB` (`INNODB_SYS_TABLES`, `INNODB_SYS_TABLESPACES` e `INNODB_SYS_TABLESTATS`) para coletar informações sobre file format, row format, page size e index size sobre tabelas no Database de exemplo employees.

Os seguintes aliases de nome de tabela são usados para encurtar a string da Query:

* `INFORMATION_SCHEMA.INNODB_SYS_TABLES`: a

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES`: b

* `INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS`: c

Uma função de fluxo de controle `IF()` é usada para contabilizar tabelas compactadas. Se uma tabela estiver compactada, o index size é calculado usando `ZIP_PAGE_SIZE` em vez de `PAGE_SIZE`. `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE`, que são relatados em bytes, são divididos por `1024*1024` para fornecer os index sizes em megabytes (MBs). Os valores de MB são arredondados para zero casas decimais usando a função `ROUND()`.

```sql
mysql> SELECT a.NAME, a.FILE_FORMAT, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+-------------+------------+-----------+-------+-----------+
| NAME                   | FILE_FORMAT | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+-------------+------------+-----------+-------+-----------+
| employees/titles       | Antelope    | Compact    |     16384 |    20 |        11 |
| employees/salaries     | Antelope    | Compact    |     16384 |    91 |        33 |
| employees/employees    | Antelope    | Compact    |     16384 |    15 |         0 |
| employees/dept_manager | Antelope    | Compact    |     16384 |     0 |         0 |
| employees/dept_emp     | Antelope    | Compact    |     16384 |    12 |        10 |
| employees/departments  | Antelope    | Compact    |     16384 |     0 |         0 |
+------------------------+-------------+------------+-----------+-------+-----------+
```