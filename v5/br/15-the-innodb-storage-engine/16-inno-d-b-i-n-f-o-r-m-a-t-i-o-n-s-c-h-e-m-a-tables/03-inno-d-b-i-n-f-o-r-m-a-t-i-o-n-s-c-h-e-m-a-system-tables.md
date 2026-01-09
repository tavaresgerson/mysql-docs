### 14.16.3 Tabelas do esquema de informações do InnoDB

Você pode extrair metadados sobre objetos de esquema gerenciados pelo `InnoDB` usando as tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB`. Essas informações vêm das tabelas internas do sistema do `InnoDB` (também conhecidas como o dicionário de dados do `InnoDB`), que não podem ser consultadas diretamente como tabelas regulares do `InnoDB`. Tradicionalmente, você obteria esse tipo de informação usando as técnicas da Seção 14.18, “Monitoramento do `InnoDB’”, configurando monitores do `InnoDB`e analisando a saída da instrução`SHOW ENGINE INNODB STATUS`. A interface da tabela `INFORMATION_SCHEMA`do`InnoDB\` permite que você consulte esses dados usando SQL.

Com exceção de `INNODB_SYS_TABLESTATS`, para a qual não existe uma tabela interna correspondente, as tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB` são preenchidas com dados lidos diretamente de tabelas internas do sistema `InnoDB`, e não de metadados armazenados em cache na memória.

As tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB` incluem as tabelas listadas abaixo.

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

Os nomes das tabelas indicam o tipo de dados fornecidos:

- `INNODB_SYS_TABLES` fornece metadados sobre as tabelas `InnoDB`, equivalentes às informações na tabela `SYS_TABLES` no dicionário de dados `InnoDB`.

- `INNODB_SYS_COLUMNS` fornece metadados sobre as colunas das tabelas `InnoDB`, equivalentes às informações na tabela `SYS_COLUMNS` no dicionário de dados `InnoDB`.

- `INNODB_SYS_INDEXES` fornece metadados sobre os índices do `InnoDB`, equivalentes às informações na tabela `SYS_INDEXES` no dicionário de dados do `InnoDB`.

- `INNODB_SYS_FIELDS` fornece metadados sobre as colunas-chave (campos) dos índices do `InnoDB`, equivalentes às informações na tabela `SYS_FIELDS` do dicionário de dados do `InnoDB`.

- `INNODB_SYS_TABLESTATS` fornece uma visão de informações de status de nível baixo sobre as tabelas `InnoDB` que são derivadas de estruturas de dados em memória. Não existe uma tabela interna correspondente do sistema `InnoDB`.

- `INNODB_SYS_DATAFILES` fornece informações sobre o caminho dos arquivos de dados para `InnoDB` (arquivo por tabela) e espaços de tabela gerais, equivalentes às informações na tabela `SYS_DATAFILES` no dicionário de dados do `InnoDB`.

- `INNODB_SYS_TABLESPACES` fornece metadados sobre os espaços de tabelas `InnoDB` e espaços de tabelas gerais, equivalentes às informações na tabela `SYS_TABLESPACES` no dicionário de dados do `InnoDB`.

- `INNODB_SYS_FOREIGN` fornece metadados sobre as chaves estrangeiras definidas em tabelas `InnoDB`, equivalentes às informações na tabela `SYS_FOREIGN` no dicionário de dados `InnoDB`.

- `INNODB_SYS_FOREIGN_COLS` fornece metadados sobre as colunas de chaves estrangeiras definidas em tabelas `InnoDB`, equivalentes às informações na tabela `SYS_FOREIGN_COLS` no dicionário de dados `InnoDB`.

As tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB` podem ser unidas por meio de campos como `TABLE_ID`, `INDEX_ID` e `SPACE`, permitindo que você recupere facilmente todos os dados disponíveis para um objeto que você deseja estudar ou monitorar.

Consulte a documentação do `InnoDB` do esquema de informações para obter informações sobre as colunas de cada tabela.

**Exemplo 14.2 Tabelas do Sistema InnoDB INFORMATION_SCHEMA**

Este exemplo usa uma tabela simples (`t1`) com um único índice (`i1`) para demonstrar o tipo de metadados encontrados nas tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB`.

1. Crie um banco de dados de teste e uma tabela `t1`:

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

2. Após criar a tabela `t1`, execute a consulta `INNODB_SYS_TABLES` para localizar os metadados para `test/t1`:

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

   A tabela `t1` tem um `TABLE_ID` de 71. O campo `FLAG` fornece informações em nível de bits sobre o formato da tabela e as características de armazenamento. Existem seis colunas, três das quais são colunas ocultas criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O ID da `SPACE` da tabela é 57 (um valor de 0 indicaria que a tabela reside no espaço de tabelas do sistema). O `FILE_FORMAT` é Antelope e o `ROW_FORMAT` é Compact. O `ZIP_PAGE_SIZE` só se aplica a tabelas com um formato de linha `Compressed`.

3. Usando a informação `TABLE_ID` da `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_COLUMNS` para obter informações sobre as colunas da tabela.

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

   Além do `TABLE_ID` e da coluna `NOME`, o `INNODB_SYS_COLUMNS` fornece a posição ordinal (`POS`) de cada coluna (começando de 0 e incrementando sequencialmente), a coluna `MTYPE` ou “tipo principal” (6 = INT, 2 = CHAR, 1 = VARCHAR), o `PRTYPE` ou “tipo preciso” (um valor binário com bits que representam o tipo de dados MySQL, o código do conjunto de caracteres e a nulidade) e o comprimento da coluna (`LEN`).

4. Usando as informações do `TABLE_ID` do `INNODB_SYS_TABLES`, novamente, consulte `INNODB_SYS_INDEXES` para obter informações sobre os índices associados à tabela `t1`.

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

   `INNODB_SYS_INDEXES` retorna dados para dois índices. O primeiro índice é `GEN_CLUST_INDEX`, que é um índice agrupado criado pelo `InnoDB` se a tabela não tiver um índice agrupado definido pelo usuário. O segundo índice (`i1`) é o índice secundário definido pelo usuário.

   O `INDEX_ID` é um identificador para o índice que é único em todas as bases de dados de uma instância. O `TABLE_ID` identifica a tabela com a qual o índice está associado. O valor `TYPE` do índice indica o tipo de índice (1 = Índice Clusterado, 0 = Índice Secundário). O valor `N_FILEDS` é o número de campos que compõem o índice. `PAGE_NO` é o número da página raiz do índice B-tree, e `SPACE` é o ID do tablespace onde o índice reside. Um valor diferente de zero indica que o índice não reside no tablespace de sistema. `MERGE_THRESHOLD` define um valor de limiar percentual para a quantidade de dados em uma página de índice. Se a quantidade de dados em uma página de índice cair abaixo deste valor (o padrão é 50%) quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha.

5. Usando as informações `INDEX_ID` de `INNODB_SYS_INDEXES`, consulte `INNODB_SYS_FIELDS` para obter informações sobre os campos do índice `i1`.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_SYS_FIELDS` fornece o `NOME` do campo indexado e sua posição ordinal dentro do índice. Se o índice (i1) tivesse sido definido em vários campos, `INNODB_SYS_FIELDS` forneceria metadados para cada um dos campos indexados.

6. Usando as informações `SPACE` de `INNODB_SYS_TABLES`, consulte a tabela `INNODB_SYS_TABLESPACES` para obter informações sobre o espaço de tabela da tabela.

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

   Além do ID `SPACE` do tablespace e do `NOME` da tabela associada, o `INNODB_SYS_TABLESPACES` fornece dados do `FLAG` do tablespace, que são informações em nível de bits sobre o formato do tablespace e as características de armazenamento. Também são fornecidos o `FILE_FORMAT`, `ROW_FORMAT`, `PAGE_SIZE` e vários outros itens de metadados do tablespace.

7. Usando as informações `SPACE` de `INNODB_SYS_TABLES`, novamente, consulte `INNODB_SYS_DATAFILES` para localizar o arquivo de dados do espaço de tabelas.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   O arquivo de dados está localizado no diretório `test` sob o diretório `data` do MySQL. Se um espaço de tabela por arquivo fosse criado em um local fora do diretório de dados do MySQL usando a cláusula `DATA DIRECTORY` da instrução `CREATE TABLE`, o espaço de tabela `PATH` seria um caminho de diretório totalmente qualificado.

8. Como último passo, insira uma linha na tabela `t1` (`TABLE_ID = 71`) e visualize os dados na tabela `INNODB_SYS_TABLESTATS`. Os dados desta tabela são usados pelo otimizador do MySQL para calcular qual índice usar ao consultar uma tabela `InnoDB`. Essas informações são derivadas de estruturas de dados em memória. Não existe uma tabela interna correspondente do sistema `InnoDB`.

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

   O campo `STATS_INITIALIZED` indica se as estatísticas foram coletadas ou não para a tabela. `NUM_ROWS` é o número estimado atual de linhas na tabela. Os campos `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE` relatam o número de páginas no disco que armazenam índices agrupados e secundários para a tabela, respectivamente. O valor `MODIFIED_COUNTER` mostra o número de linhas modificadas por operações DML e operações em cascata a partir de chaves estrangeiras. O valor `AUTOINC` é o próximo número a ser emitido para qualquer operação baseada em autoincremento. Não há colunas de autoincremento definidas na tabela `t1`, portanto, o valor é 0. O valor `REF_COUNT` é um contador. Quando o contador atingir 0, isso significa que os metadados da tabela podem ser expulsos do cache da tabela.

**Exemplo 14.3 Tabelas do Sistema INFORMATION_SCHEMA de Chave Estrangeira**

As tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS` fornecem dados sobre as relações de chave estrangeira. Este exemplo usa uma tabela pai e uma tabela filho com uma relação de chave estrangeira para demonstrar os dados encontrados nas tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`.

1. Crie o banco de dados de teste com tabelas pai e filho:

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

2. Após a criação das tabelas pai e filho, execute a consulta `INNODB_SYS_FOREIGN` e localize os dados da chave estrangeira para a relação de chave estrangeira `test/child` e `test/parent`:

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Os metadados incluem a chave estrangeira `ID` (`fk1`), que é nomeada para a `CONSTRAINT` que foi definida na tabela filha. `FOR_NAME` é o nome da tabela filha onde a chave estrangeira é definida. `REF_NAME` é o nome da tabela pai (a tabela "referenciada"). `N_COLS` é o número de colunas no índice da chave estrangeira. `TYPE` é um valor numérico que representa bits que fornecem informações adicionais sobre a coluna da chave estrangeira. Neste caso, o valor de `TYPE` é 1, o que indica que a opção `ON DELETE CASCADE` foi especificada para a chave estrangeira. Consulte a definição da tabela `INNODB_SYS_FOREIGN` para obter mais informações sobre os valores de `TYPE`.

3. Utilize a chave estrangeira `ID` e a consulta `INNODB_SYS_FOREIGN_COLS` para visualizar dados sobre as colunas da chave estrangeira.

   ```sql
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` é o nome da coluna de chave estrangeira na tabela filha, e `REF_COL_NAME` é o nome da coluna referenciada na tabela pai. O valor `POS` é a posição ordinal do campo chave dentro do índice de chave estrangeira, começando em zero.

**Exemplo 14.4: Conexão às tabelas do esquema de informações do InnoDB**

Este exemplo demonstra a junção de três tabelas do sistema `INFORMATION_SCHEMA` do `InnoDB` (`INNODB_SYS_TABLES`, `INNODB_SYS_TABLESPACES` e `INNODB_SYS_TABLESTATS`) para coletar informações sobre o formato do arquivo, o formato da linha, o tamanho da página e o tamanho do índice sobre as tabelas no banco de dados de amostra de funcionários.

Os seguintes aliases de nomes de tabela são usados para encurtar a string de consulta:

- `INFORMATION_SCHEMA.INNODB_SYS_TABLES`: um

- `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES`: b

- `INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS`: c

Uma função de fluxo de controle `IF()` é usada para contabilizar tabelas compactadas. Se uma tabela estiver compactada, o tamanho do índice é calculado usando `ZIP_PAGE_SIZE` em vez de `PAGE_SIZE`. `CLUST_INDEX_SIZE` e `OTHER_INDEX_SIZE`, que são relatados em bytes, são divididos por `1024*1024` para fornecer tamanhos de índice em megabytes (MB). Os valores em MB são arredondados para zero casas decimais usando a função `ROUND()`.

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
