## 14.11 Formatos de Linha do InnoDB

O formato de linha de uma tabela determina como suas linhas são armazenadas fisicamente, o que, por sua vez, pode afetar o performance de Queries e operações DML. À medida que mais linhas cabem em uma única page de disco, as Queries e buscas de Index podem funcionar mais rapidamente, menos memória cache é necessária no Buffer Pool, e menos I/O é exigido para escrever valores atualizados.

Os dados em cada tabela são divididos em pages. As pages que compõem cada tabela são organizadas em uma estrutura de dados em árvore chamada B-tree index. Tanto os dados da tabela quanto os secondary indexes usam este tipo de estrutura. O B-tree index que representa uma tabela inteira é conhecido como clustered index, que é organizado de acordo com as colunas Primary Key. Os nós de uma estrutura de dados de clustered index contêm os valores de todas as colunas na linha. Os nós de uma estrutura de secondary index contêm os valores das colunas Index e das colunas Primary Key.

Colunas de tamanho variável são uma exceção à regra de que os valores das colunas são armazenados nos nós do B-tree index. Colunas de tamanho variável que são muito longas para caber em uma page B-tree são armazenadas em pages de disco alocadas separadamente, chamadas overflow pages. Tais colunas são referidas como colunas off-page. Os valores das colunas off-page são armazenados em listas ligadas (singly-linked lists) de overflow pages, sendo que cada coluna tem sua própria lista de uma ou mais overflow pages. Dependendo do tamanho da coluna, todos ou um prefixo dos valores de colunas de tamanho variável são armazenados no B-tree para evitar desperdício de armazenamento e a necessidade de ler uma page separada.

O storage engine `InnoDB` suporta quatro formatos de linha: `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`.

**Tabela 14.9 Visão Geral dos Formatos de Linha do InnoDB**

| Formato de Linha | Características de Armazenamento Compacto | Armazenamento Aprimorado de Colunas de Tamanho Variável | Suporte a Prefixos de Key de Index Grandes | Suporte à Compressão | Tipos de Tablespace Suportados | Formato de Arquivo Necessário |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `REDUNDANT` | Não | Não | Não | Não | system, file-per-table, general | Antelope ou Barracuda |
| `COMPACT` | Sim | Não | Não | Não | system, file-per-table, general | Antelope ou Barracuda |
| `DYNAMIC` | Sim | Sim | Sim | Não | system, file-per-table, general | Barracuda |
| `COMPRESSED` | Sim | Sim | Sim | Sim | file-per-table, general | Barracuda |

Os tópicos a seguir descrevem as características de armazenamento dos formatos de linha e como definir e determinar o formato de linha de uma tabela.

* Formato de Linha REDUNDANT
* Formato de Linha COMPACT
* Formato de Linha DYNAMIC
* Formato de Linha COMPRESSED
* Definição do Formato de Linha de uma Tabela
* Determinação do Formato de Linha de uma Tabela

### Formato de Linha REDUNDANT

O formato `REDUNDANT` fornece compatibilidade com versões mais antigas do MySQL.

O formato de linha `REDUNDANT` é suportado por ambos os formatos de arquivo `InnoDB` (`Antelope` e `Barracuda`). Para mais informações, consulte a Seção 14.10, “InnoDB File-Format Management”.

Tabelas que usam o formato de linha `REDUNDANT` armazenam os primeiros 768 bytes dos valores de colunas de tamanho variável (`VARCHAR`, `VARBINARY` e tipos `BLOB` e `TEXT`) no registro do Index dentro do nó B-tree, com o restante armazenado em overflow pages. Colunas de tamanho fixo maiores ou iguais a 768 bytes são codificadas como colunas de tamanho variável, que podem ser armazenadas off-page. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o tamanho máximo de byte do character set for maior que 3, como é o caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma overflow page não é usada, e alguma economia em I/O pode resultar, uma vez que o valor é armazenado inteiramente no nó B-tree. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós B-tree se encham com dados em vez de valores Key, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós B-tree fiquem muito cheios e contenham poucas linhas, tornando o Index inteiro menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados off-page.

#### Características de Armazenamento do Formato de Linha REDUNDANT

O formato de linha `REDUNDANT` possui as seguintes características de armazenamento:

* Cada registro de Index contém um cabeçalho de 6 bytes. O cabeçalho é usado para ligar registros consecutivos e para locking de nível de linha.

* Registros no clustered index contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo roll pointer de 7 bytes.

* Se nenhuma Primary Key for definida para uma tabela, cada registro de clustered index também contém um campo de ID de linha de 6 bytes.

* Cada registro de secondary index contém todas as colunas Primary Key definidas para a Key do clustered index que não estão no secondary index.

* Um registro contém um pointer para cada campo do registro. Se o comprimento total dos campos em um registro for menor que 128 bytes, o pointer é de um byte; caso contrário, dois bytes. O array de pointers é chamado de diretório de registro (record directory). A área para onde os pointers apontam é a parte de dados do registro.

* Internamente, colunas de caracteres de tamanho fixo, como `CHAR(10)`, são armazenadas em formato de tamanho fixo. Espaços à direita não são truncados de colunas `VARCHAR`.

* Colunas de tamanho fixo maiores ou iguais a 768 bytes são codificadas como colunas de tamanho variável, que podem ser armazenadas off-page. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o tamanho máximo de byte do character set for maior que 3, como é o caso do `utf8mb4`.

* Um valor SQL `NULL` reserva um ou dois bytes no record directory. Um valor SQL `NULL` reserva zero bytes na parte de dados do registro se armazenado em uma coluna de tamanho variável. Para uma coluna de tamanho fixo, o tamanho fixo da coluna é reservado na parte de dados do registro. Reservar espaço fixo para valores `NULL` permite que as colunas sejam atualizadas in-place de valores `NULL` para não-`NULL` sem causar fragmentação de page de Index.

### Formato de Linha COMPACT

O formato de linha `COMPACT` reduz o espaço de armazenamento de linha em cerca de 20% em comparação com o formato de linha `REDUNDANT`, ao custo de aumentar o uso de CPU para algumas operações. Se sua workload for típica e limitada pelas taxas de acerto do cache e pela velocidade do disco, o formato `COMPACT` provavelmente será mais rápido. Se a workload for limitada pela velocidade da CPU, o formato compacto pode ser mais lento.

O formato de linha `COMPACT` é suportado por ambos os formatos de arquivo `InnoDB` (`Antelope` e `Barracuda`). Para mais informações, consulte a Seção 14.10, “InnoDB File-Format Management”.

Tabelas que usam o formato de linha `COMPACT` armazenam os primeiros 768 bytes dos valores de colunas de tamanho variável (`VARCHAR`, `VARBINARY` e tipos `BLOB` e `TEXT`) no registro do Index dentro do nó B-tree, com o restante armazenado em overflow pages. Colunas de tamanho fixo maiores ou iguais a 768 bytes são codificadas como colunas de tamanho variável, que podem ser armazenadas off-page. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o tamanho máximo de byte do character set for maior que 3, como é o caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma overflow page não é usada, e alguma economia em I/O pode resultar, uma vez que o valor é armazenado inteiramente no nó B-tree. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós B-tree se encham com dados em vez de valores Key, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós B-tree fiquem muito cheios e contenham poucas linhas, tornando o Index inteiro menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados off-page.

#### Características de Armazenamento do Formato de Linha COMPACT

O formato de linha `COMPACT` possui as seguintes características de armazenamento:

* Cada registro de Index contém um cabeçalho de 5 bytes que pode ser precedido por um cabeçalho de tamanho variável. O cabeçalho é usado para ligar registros consecutivos e para locking de nível de linha.

* A parte de tamanho variável do cabeçalho do registro contém um vetor de bits para indicar colunas `NULL`. Se o número de colunas no Index que podem ser `NULL` for *`N`*, o vetor de bits ocupa `CEILING(N/8)` bytes. (Por exemplo, se houver de 9 a 16 colunas que podem ser `NULL`, o vetor de bits usa dois bytes.) Colunas que são `NULL` não ocupam espaço além do bit neste vetor. A parte de tamanho variável do cabeçalho também contém os comprimentos das colunas de tamanho variável. Cada comprimento leva um ou dois bytes, dependendo do comprimento máximo da coluna. Se todas as colunas no Index forem `NOT NULL` e tiverem um tamanho fixo, o cabeçalho do registro não terá uma parte de tamanho variável.

* Para cada campo de tamanho variável não-`NULL`, o cabeçalho do registro contém o comprimento da coluna em um ou dois bytes. Dois bytes são necessários apenas se parte da coluna for armazenada externamente em overflow pages ou se o comprimento máximo exceder 255 bytes e o comprimento real exceder 127 bytes. Para uma coluna armazenada externamente, o comprimento de 2 bytes indica o comprimento da parte armazenada internamente mais o pointer de 20 bytes para a parte armazenada externamente. A parte interna é de 768 bytes, portanto o comprimento é 768+20. O pointer de 20 bytes armazena o comprimento verdadeiro da coluna.

* O cabeçalho do registro é seguido pelo conteúdo dos dados das colunas não-`NULL`.

* Registros no clustered index contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo roll pointer de 7 bytes.

* Se nenhuma Primary Key for definida para uma tabela, cada registro de clustered index também contém um campo de ID de linha de 6 bytes.

* Cada registro de secondary index contém todas as colunas Primary Key definidas para a Key do clustered index que não estão no secondary index. Se alguma das colunas Primary Key for de tamanho variável, o cabeçalho do registro para cada secondary index tem uma parte de tamanho variável para registrar seus comprimentos, mesmo que o secondary index seja definido em colunas de tamanho fixo.

* Internamente, para character sets de tamanho não variável, colunas de caracteres de tamanho fixo, como `CHAR(10)`, são armazenadas em um formato de tamanho fixo.

  Espaços à direita não são truncados de colunas `VARCHAR`.

* Internamente, para character sets de tamanho variável, como `utf8mb3` e `utf8mb4`, o `InnoDB` tenta armazenar `CHAR(N)` em *`N`* bytes, removendo espaços à direita. Se o tamanho de byte do valor de uma coluna `CHAR(N)` exceder *`N`* bytes, os espaços à direita são removidos para um mínimo do tamanho de byte do valor da coluna. O comprimento máximo de uma coluna `CHAR(N)` é o tamanho máximo de byte do caractere × *`N`*.

  Um mínimo de *`N`* bytes é reservado para `CHAR(N)`. Reservar o espaço mínimo *`N`* em muitos casos permite que as atualizações de coluna sejam feitas in-place sem causar fragmentação de page de Index. Em comparação, as colunas `CHAR(N)` ocupam o tamanho máximo de byte do caractere × *`N`* ao usar o formato de linha `REDUNDANT`.

  Colunas de tamanho fixo maiores ou iguais a 768 bytes são codificadas como campos de tamanho variável, que podem ser armazenados off-page. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o tamanho máximo de byte do character set for maior que 3, como é o caso do `utf8mb4`.

### Formato de Linha DYNAMIC

O formato de linha `DYNAMIC` oferece as mesmas características de armazenamento que o formato de linha `COMPACT`, mas adiciona capacidades aprimoradas de armazenamento para colunas longas de tamanho variável e suporta prefixos de Index Key grandes.

O formato de arquivo Barracuda suporta o formato de linha `DYNAMIC`. Consulte a Seção 14.10, “InnoDB File-Format Management”.

Quando uma tabela é criada com `ROW_FORMAT=DYNAMIC`, o `InnoDB` pode armazenar valores de colunas longas de tamanho variável (para tipos `VARCHAR`, `VARBINARY` e `BLOB` e `TEXT`) totalmente off-page, com o registro do clustered index contendo apenas um pointer de 20 bytes para a overflow page. Campos de tamanho fixo maiores ou iguais a 768 bytes são codificados como campos de tamanho variável. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o tamanho máximo de byte do character set for maior que 3, como é o caso do `utf8mb4`.

Se as colunas são armazenadas off-page depende do tamanho da page e do tamanho total da linha. Quando uma linha é muito longa, as colunas mais longas são escolhidas para armazenamento off-page até que o registro do clustered index caiba na page B-tree. As colunas `TEXT` e `BLOB` menores ou iguais a 40 bytes são armazenadas in-line.

O formato de linha `DYNAMIC` mantém a eficiência de armazenar a linha inteira no nó Index se ela couber (assim como os formatos `COMPACT` e `REDUNDANT`), mas o formato de linha `DYNAMIC` evita o problema de preencher nós B-tree com um grande número de bytes de dados de colunas longas. O formato de linha `DYNAMIC` é baseado na ideia de que, se uma porção de um valor de dados longo for armazenada off-page, geralmente é mais eficiente armazenar o valor inteiro off-page. Com o formato `DYNAMIC`, é provável que as colunas mais curtas permaneçam no nó B-tree, minimizando o número de overflow pages necessárias para uma determinada linha.

O formato de linha `DYNAMIC` suporta prefixos de Index Key de até 3072 bytes. Este recurso é controlado pela variável `innodb_large_prefix`, que é ativada por padrão. Consulte a descrição da variável `innodb_large_prefix` para mais informações.

Tabelas que usam o formato de linha `DYNAMIC` podem ser armazenadas no system tablespace, file-per-table tablespaces e general tablespaces. Para armazenar tabelas `DYNAMIC` no system tablespace, desabilite `innodb_file_per_table` e use uma instrução `CREATE TABLE` ou `ALTER TABLE` regular, ou use a opção de tabela `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE`. As variáveis `innodb_file_per_table` e `innodb_file_format` não se aplicam a general tablespaces, nem se aplicam ao usar a opção de tabela `TABLESPACE [=] innodb_system` para armazenar tabelas `DYNAMIC` no system tablespace.

#### Características de Armazenamento do Formato de Linha DYNAMIC

O formato de linha `DYNAMIC` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha COMPACT.

### Formato de Linha COMPRESSED

O formato de linha `COMPRESSED` oferece as mesmas características e capacidades de armazenamento que o formato de linha `DYNAMIC`, mas adiciona suporte para compressão de dados de tabela e Index.

O formato de arquivo Barracuda suporta o formato de linha `COMPRESSED`. Consulte a Seção 14.10, “InnoDB File-Format Management”.

O formato de linha `COMPRESSED` usa detalhes internos semelhantes para armazenamento off-page como o formato de linha `DYNAMIC`, com considerações adicionais de armazenamento e performance devido à compressão dos dados da tabela e do Index e ao uso de page sizes menores. Com o formato de linha `COMPRESSED`, a opção `KEY_BLOCK_SIZE` controla quantos dados de coluna são armazenados no clustered index e quanto é colocado em overflow pages. Para mais informações sobre o formato de linha `COMPRESSED`, consulte a Seção 14.9, “InnoDB Table and Page Compression”.

O formato de linha `COMPRESSED` suporta prefixos de Index Key de até 3072 bytes. Este recurso é controlado pela variável `innodb_large_prefix`, que é ativada por padrão. Consulte a descrição da variável `innodb_large_prefix` para mais informações.

Tabelas que usam o formato de linha `COMPRESSED` podem ser criadas em file-per-table tablespaces ou general tablespaces. O system tablespace não suporta o formato de linha `COMPRESSED`. Para armazenar uma tabela `COMPRESSED` em um file-per-table tablespace, a variável `innodb_file_per_table` deve estar ativada e `innodb_file_format` deve ser definido como `Barracuda`. As variáveis `innodb_file_per_table` e `innodb_file_format` não se aplicam a general tablespaces. General tablespaces suportam todos os formatos de linha, com a ressalva de que tabelas compactadas e descompactadas não podem coexistir no mesmo general tablespace devido a diferentes page sizes físicos. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

#### Características de Armazenamento do Formato de Linha COMPRESSED

O formato de linha `COMPRESSED` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha COMPACT.

### Definição do Formato de Linha de uma Tabela

O formato de linha padrão para tabelas `InnoDB` é definido pela variável `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção de tabela `ROW_FORMAT` não é definida explicitamente ou quando `ROW_FORMAT=DEFAULT` é especificado.

O formato de linha de uma tabela pode ser definido explicitamente usando a opção de tabela `ROW_FORMAT` em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Por exemplo:

```sql
CREATE TABLE t1 (c1 INT) ROW_FORMAT=DYNAMIC;
```

Uma configuração `ROW_FORMAT` definida explicitamente substitui o formato de linha padrão. Especificar `ROW_FORMAT=DEFAULT` é equivalente a usar o padrão implícito.

A variável `innodb_default_row_format` pode ser definida dinamicamente:

```sql
mysql> SET GLOBAL innodb_default_row_format=DYNAMIC;
```

As opções válidas para `innodb_default_row_format` incluem `DYNAMIC`, `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no system tablespace, não pode ser definido como padrão. Ele só pode ser especificado explicitamente em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Tentar definir a variável `innodb_default_row_format` como `COMPRESSED` retorna um erro:

```sql
mysql> SET GLOBAL innodb_default_row_format=COMPRESSED;
ERROR 1231 (42000): Variable 'innodb_default_row_format'
can't be set to the value of 'COMPRESSED'
```

Tabelas recém-criadas usam o formato de linha definido pela variável `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usado. Por exemplo, as seguintes instruções `CREATE TABLE` usam o formato de linha definido pela variável `innodb_default_row_format`.

```sql
CREATE TABLE t1 (c1 INT);
```

```sql
CREATE TABLE t2 (c1 INT) ROW_FORMAT=DEFAULT;
```

Quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usado, uma operação que reconstrói uma tabela muda silenciosamente o formato de linha da tabela para o formato definido pela variável `innodb_default_row_format`.

As operações de reconstrução de tabela incluem operações `ALTER TABLE` que usam `ALGORITHM=COPY` ou `ALGORITHM=INPLACE` onde a reconstrução da tabela é necessária. Consulte a Seção 14.13.1, “Online DDL Operations” para mais informações. `OPTIMIZE TABLE` também é uma operação de reconstrução de tabela.

O exemplo a seguir demonstra uma operação de reconstrução de tabela que muda silenciosamente o formato de linha de uma tabela criada sem um formato de linha definido explicitamente.

```sql
mysql> SELECT @@innodb_default_row_format;
+-----------------------------+
| @@innodb_default_row_format |
+-----------------------------+
| dynamic                     |
+-----------------------------+

mysql> CREATE TABLE t1 (c1 INT);

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE 'test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 54
         NAME: test/t1
         FLAG: 33
       N_COLS: 4
        SPACE: 35
  FILE_FORMAT: Barracuda
   ROW_FORMAT: Dynamic
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single

mysql> SET GLOBAL innodb_default_row_format=COMPACT;

mysql> ALTER TABLE t1 ADD COLUMN (c2 INT);

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME LIKE 'test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 55
         NAME: test/t1
         FLAG: 1
       N_COLS: 5
        SPACE: 36
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single
```

Considere os seguintes problemas potenciais antes de mudar o formato de linha de tabelas existentes de `REDUNDANT` ou `COMPACT` para `DYNAMIC`.

* Os formatos de linha `REDUNDANT` e `COMPACT` suportam um comprimento máximo de prefixo de Index Key de 767 bytes, enquanto os formatos de linha `DYNAMIC` e `COMPRESSED` suportam um comprimento de prefixo de Index Key de 3072 bytes. Em um ambiente de replicação, se a variável `innodb_default_row_format` estiver definida como `DYNAMIC` na origem (source), e definida como `COMPACT` na réplica, a seguinte instrução DDL, que não define explicitamente um formato de linha, terá sucesso na origem, mas falhará na réplica:

  ```sql
  CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 VARCHAR(5000), KEY i1(c2(3070)));
  ```

  Para informações relacionadas, consulte a Seção 14.23, “InnoDB Limits”.

* A importação de uma tabela que não define explicitamente um formato de linha resulta em um erro de schema mismatch se a configuração `innodb_default_row_format` no servidor de origem for diferente da configuração no servidor de destino. Para mais informações, Seção 14.6.1.3, “Importing InnoDB Tables”.

### Determinação do Formato de Linha de uma Tabela

Para determinar o formato de linha de uma tabela, use `SHOW TABLE STATUS`:

```sql
mysql> SHOW TABLE STATUS IN test1\G
*************************** 1. row ***************************
           Name: t1
         Engine: InnoDB
        Version: 10
     Row_format: Dynamic
           Rows: 0
 Avg_row_length: 0
    Data_length: 16384
Max_data_length: 0
   Index_length: 16384
      Data_free: 0
 Auto_increment: 1
    Create_time: 2016-09-14 16:29:38
    Update_time: NULL
     Check_time: NULL
      Collation: latin1_swedish_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Alternativamente, consulte a tabela `INNODB_SYS_TABLES` do Information Schema:

```sql
mysql> SELECT NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test1/t1';
+----------+------------+
| NAME     | ROW_FORMAT |
+----------+------------+
| test1/t1 | Dynamic    |
+----------+------------+
```