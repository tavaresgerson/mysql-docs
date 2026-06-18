### 17.15.3 Objetos de esquema do esquema INFORMATION\_SCHEMA do InnoDB

Você pode extrair metadados sobre objetos de esquema gerenciados pelo `InnoDB` usando as tabelas `InnoDB` `INFORMATION_SCHEMA` `InnoDB`. Essas informações vêm do dicionário de dados. Tradicionalmente, você obteria esse tipo de informação usando as técnicas da Seção 17.17, “Monitores InnoDB”, configurando monitores `SHOW ENGINE INNODB STATUS` e analisando a saída da instrução `InnoDB`. A interface da tabela `INFORMATION_SCHEMA` permite que você consulte esses dados usando SQL.

As tabelas de objetos de esquema `InnoDB` e `INFORMATION_SCHEMA` incluem as tabelas listadas abaixo.

```
INNODB_DATAFILES
INNODB_TABLESTATS
INNODB_FOREIGN
INNODB_COLUMNS
INNODB_INDEXES
INNODB_FIELDS
INNODB_TABLESPACES
INNODB_TABLESPACES_BRIEF
INNODB_FOREIGN_COLS
INNODB_TABLES
```

Os nomes das tabelas indicam o tipo de dados fornecidos:

- `INNODB_TABLES` fornece metadados sobre as tabelas `InnoDB`.

- `INNODB_COLUMNS` fornece metadados sobre as colunas da tabela `InnoDB`.

- `INNODB_INDEXES` fornece metadados sobre os índices `InnoDB`.

- `INNODB_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices `InnoDB`.

- `INNODB_TABLESTATS` fornece uma visão de informações de status de nível baixo sobre as tabelas `InnoDB` que são derivadas de estruturas de dados em memória.

- `INNODB_DATAFILES` fornece informações sobre o caminho do arquivo de dados para os arquivos por tabela `InnoDB` e espaços de tabela gerais.

- `INNODB_TABLESPACES` fornece metadados sobre os espaços de tabela `InnoDB` de arquivo por tabela, gerais e de desfazer.

- `INNODB_TABLESPACES_BRIEF` fornece um subconjunto de metadados sobre os espaços de tabelas `InnoDB`.

- `INNODB_FOREIGN` fornece metadados sobre as chaves estrangeiras definidas nas tabelas `InnoDB`.

- `INNODB_FOREIGN_COLS` fornece metadados sobre as colunas de chaves estrangeiras definidas nas tabelas `InnoDB`.

As tabelas de objetos do esquema `InnoDB` `INFORMATION_SCHEMA` podem ser unidas por meio de campos como `TABLE_ID`, `INDEX_ID` e `SPACE`, permitindo que você recupere facilmente todos os dados disponíveis para um objeto que você deseja estudar ou monitorar.

Consulte a documentação do `InnoDB` INFORMATION\_SCHEMA para obter informações sobre as colunas de cada tabela.

**Exemplo 17.2: Tabelas de Objetos do Esquema InnoDB INFORMATION\_SCHEMA**

Este exemplo usa uma tabela simples (`t1`) com um único índice (`i1`) para demonstrar o tipo de metadados encontrados nas tabelas dos objetos de esquema `InnoDB` `INFORMATION_SCHEMA`.

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

   A tabela `t1` tem um `TABLE_ID` de 71. O campo `FLAG` fornece informações em nível de bits sobre o formato da tabela e as características de armazenamento. Existem seis colunas, três das quais são colunas ocultas criadas por `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O ID da tabela `SPACE` é 57 (um valor de 0 indicaria que a tabela reside no espaço de tabelas do sistema). O `ROW_FORMAT` é Compacto. `ZIP_PAGE_SIZE` só se aplica a tabelas com um formato de linha `Compressed`. `INSTANT_COLS` mostra o número de colunas na tabela antes de adicionar a primeira coluna instantânea usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`.

3. Usando as informações do `TABLE_ID` do `INNODB_TABLES`, consulte a tabela `INNODB_COLUMNS` para obter informações sobre as colunas da tabela.

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
   ```

   Além dos campos `TABLE_ID` e da coluna `NAME`, o `INNODB_COLUMNS` fornece a posição ordinal (`POS`) de cada coluna (a partir de 0 e incrementando sequencialmente), a coluna `MTYPE` ou “tipo principal” (6 = INT, 2 = CHAR, 1 = VARCHAR), o `PRTYPE` ou “tipo preciso” (um valor binário com bits que representam o tipo de dados MySQL, o código do conjunto de caracteres e a nulidade) e o comprimento da coluna (`LEN`). Os campos `HAS_DEFAULT` e `DEFAULT_VALUE` só se aplicam a colunas adicionadas instantaneamente usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`.

4. Usando as informações `TABLE_ID` de `INNODB_TABLES`, novamente, consulte `INNODB_INDEXES` para obter informações sobre os índices associados à tabela `t1`.

   ```
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
   ```

   `INNODB_INDEXES` retorna dados para dois índices. O primeiro índice é `GEN_CLUST_INDEX`, que é um índice agrupado criado por `InnoDB` se a tabela não tiver um índice agrupado definido pelo usuário. O segundo índice (`i1`) é o índice secundário definido pelo usuário.

   O `INDEX_ID` é um identificador para o índice que é único em todas as bases de dados de uma instância. O `TABLE_ID` identifica a tabela com a qual o índice está associado. O valor `TYPE` do índice indica o tipo de índice (1 = Índice Agrupado, 0 = Índice Secundário). O valor `N_FILEDS` é o número de campos que compõem o índice. O `PAGE_NO` é o número da página raiz da árvore B do índice, e o `SPACE` é o ID do espaço de tabelas onde o índice reside. Um valor diferente de zero indica que o índice não reside no espaço de tabelas do sistema. O `MERGE_THRESHOLD` define um valor de limiar percentual para a quantidade de dados em uma página de índice. Se a quantidade de dados em uma página de índice cair abaixo deste valor (o padrão é 50%) quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha.

5. Usando as informações do `INDEX_ID` do `INNODB_INDEXES`, consulte o `INNODB_FIELDS` para obter informações sobre os campos do índice `i1`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_FIELDS` fornece o `NAME` do campo indexado e sua posição ordinal dentro do índice. Se o índice (i1) tivesse sido definido em múltiplos campos, `INNODB_FIELDS` forneceria metadados para cada um dos campos indexados.

6. Usando as informações do `SPACE` do `INNODB_TABLES`, consulte a tabela `INNODB_TABLESPACES` para obter informações sobre o espaço de tabela da tabela.

   ```
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
   SERVER_VERSION: 8.0.23
    SPACE_VERSION: 1
       ENCRYPTION: N
            STATE: normal
   ```

   Além do ID `SPACE` do espaço de tabelas e do `NAME` da tabela associada, o `INNODB_TABLESPACES` fornece dados do espaço de tabelas `FLAG`, que são informações de nível de bits sobre o formato do espaço de tabelas e as características de armazenamento. Também são fornecidos os espaços de tabelas `ROW_FORMAT`, `PAGE_SIZE` e vários outros itens de metadados do espaço de tabelas.

7. Usando as informações `SPACE` de `INNODB_TABLES`, novamente, consulte `INNODB_DATAFILES` para localizar o arquivo de dados do espaço de tabelas.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   O arquivo de dados está localizado no diretório `test` sob o diretório `data` do MySQL. Se um espaço de tabela por arquivo fosse criado em um local fora do diretório de dados do MySQL usando a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE`, o espaço de tabela `PATH` seria um caminho de diretório totalmente qualificado.

8. Como último passo, insira uma linha na tabela `t1` (`TABLE_ID = 71`) e visualize os dados na tabela `INNODB_TABLESTATS`. Os dados desta tabela são usados pelo otimizador do MySQL para calcular qual índice usar ao consultar uma tabela `InnoDB`. Esta informação é derivada de estruturas de dados em memória.

   ```
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
   ```

   O campo `STATS_INITIALIZED` indica se as estatísticas foram coletadas ou não para a tabela. `NUM_ROWS` é o número estimado atual de linhas na tabela. Os campos `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE` relatam o número de páginas no disco que armazenam índices agrupados e secundários para a tabela, respectivamente. O valor `MODIFIED_COUNTER` mostra o número de linhas modificadas por operações DML e operações em cascata a partir de chaves estrangeiras. O valor `AUTOINC` é o próximo número a ser emitido para qualquer operação baseada em autoincremento. Não há colunas de autoincremento definidas na tabela `t1`, então o valor é 0. O valor `REF_COUNT` é um contador. Quando o contador atingir 0, isso significa que os metadados da tabela podem ser expulsos do cache da tabela.

**Exemplo 17.3: Tabelas de Objetos do Esquema INFORMATION\_SCHEMA de Chave Estrangeira**

As tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS` fornecem dados sobre as relações de chave estrangeira. Este exemplo usa uma tabela pai e uma tabela filho com uma relação de chave estrangeira para demonstrar os dados encontrados nas tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`.

1. Crie o banco de dados de teste com tabelas pai e filho:

   ```
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

2. Após a criação das tabelas pai e filho, execute a consulta `INNODB_FOREIGN` e localize os dados da chave estrangeira para a relação de chave estrangeira `test/child` e `test/parent`:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Os metadados incluem a chave estrangeira `ID` (`fk1`), que é nomeada para a chave estrangeira `CONSTRAINT` definida na tabela filha. `FOR_NAME` é o nome da tabela filha onde a chave estrangeira é definida. `REF_NAME` é o nome da tabela pai (a tabela “referenciada”). `N_COLS` é o número de colunas no índice da chave estrangeira. `TYPE` é um valor numérico que representa bits que fornecem informações adicionais sobre a coluna da chave estrangeira. Neste caso, o valor `TYPE` é 1, o que indica que a opção `ON DELETE CASCADE` foi especificada para a chave estrangeira. Consulte a definição da tabela `INNODB_FOREIGN` para obter mais informações sobre os valores de `TYPE`.

3. Usando a chave estrangeira `ID`, consulte `INNODB_FOREIGN_COLS` para visualizar dados sobre as colunas da chave estrangeira.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` é o nome da coluna de chave estrangeira na tabela filha, e `REF_COL_NAME` é o nome da coluna referenciada na tabela pai. O valor `POS` é a posição ordinal do campo chave dentro do índice de chave estrangeira, começando em zero.

**Exemplo 17.4: Conexão com as tabelas de objetos do esquema InnoDB INFORMATION\_SCHEMA**

Este exemplo demonstra a junção de três tabelas de objetos de esquema `InnoDB` `INFORMATION_SCHEMA` (`INNODB_TABLES`, `INNODB_TABLESPACES` e `INNODB_TABLESTATS`) para coletar informações sobre o formato do arquivo, o formato da linha, o tamanho da página e o tamanho do índice sobre as tabelas no banco de dados de amostra de funcionários.

As seguintes aliases de tabela são usadas para encurtar a string de consulta:

- `INFORMATION_SCHEMA.INNODB_TABLES`: um

- `INFORMATION_SCHEMA.INNODB_TABLESPACES`: b

- `INFORMATION_SCHEMA.INNODB_TABLESTATS`: c

Uma função de fluxo de controle `IF()` é usada para contabilizar tabelas compactadas. Se uma tabela estiver compactada, o tamanho do índice é calculado usando `ZIP_PAGE_SIZE` em vez de `PAGE_SIZE`. `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE`, que são relatados em bytes, são divididos por `1024*1024` para fornecer tamanhos de índice em megabytes (MBs). Os valores em MB são arredondados para zero casas decimais usando a função `ROUND()`.

```
mysql> SELECT a.NAME, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+------------+-----------+-------+-----------+
| NAME                   | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+------------+-----------+-------+-----------+
| employees/titles       | Dynamic    |     16384 |    20 |        11 |
| employees/salaries     | Dynamic    |     16384 |    93 |        34 |
| employees/employees    | Dynamic    |     16384 |    15 |         0 |
| employees/dept_manager | Dynamic    |     16384 |     0 |         0 |
| employees/dept_emp     | Dynamic    |     16384 |    12 |        10 |
| employees/departments  | Dynamic    |     16384 |     0 |         0 |
+------------------------+------------+-----------+-------+-----------+
```
