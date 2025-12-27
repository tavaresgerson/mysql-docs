## 17.10 Formatos de Linha do InnoDB

O formato de linha de uma tabela determina como suas linhas são armazenadas fisicamente, o que, por sua vez, pode afetar o desempenho de consultas e operações de manipulação de dados de nível de multimídia (DML). À medida que mais linhas cabem em uma única página de disco, consultas e buscas em índices podem funcionar mais rápido, é necessário menos memória cache no pool de buffer e é necessário menos I/O para gravar valores atualizados.

Os dados de cada tabela são divididos em páginas. As páginas que compõem cada tabela são organizadas em uma estrutura de dados em forma de árvore chamada índice B-tree. Os dados da tabela e os índices secundários usam esse tipo de estrutura. O índice B-tree que representa uma tabela inteira é conhecido como índice agrupado, que é organizado de acordo com as colunas da chave primária. Os nós de uma estrutura de dados de índice agrupado contêm os valores de todas as colunas da linha. Os nós de uma estrutura de índice secundário contêm os valores das colunas de índice e das colunas da chave primária.

Colunas de comprimento variável são uma exceção à regra de que os valores das colunas são armazenados nos nós do índice B-tree. Colunas de comprimento variável que são muito longas para caber em uma página B-tree são armazenadas em páginas de disco alocadas separadamente chamadas páginas de overflow. Tais colunas são referidas como colunas fora da página. Os valores das colunas fora da página são armazenados em listas de ponteiros simples de páginas de overflow, com cada coluna tendo sua própria lista de uma ou mais páginas de overflow. Dependendo do comprimento da coluna, todos ou um prefixo dos valores das colunas de comprimento variável são armazenados no B-tree para evitar desperdício de armazenamento e ter que ler uma página separada.

O mecanismo de armazenamento `InnoDB` suporta quatro formatos de linha: `REDUNDANTE`, `COMPACT`, `DINÂMICO` e `COMPRIMIDO`.

**Tabela 17.12 Visão Geral do Formato de Linha do InnoDB**

Os tópicos que seguem descrevem as características de armazenamento de formato de linha e como definir e determinar o formato de linha de uma tabela.

* Formato de Linha REDUNDANTE
* Formato de Linha COMPACT
* Formato de Linha DINÂMICO
* Formato de Linha COMPRESSADO
* Definindo o Formato de Linha de uma Tabela
* Determinando o Formato de Linha de uma Tabela

### REDUNDANT Row Format

O formato `REDUNDANTE` fornece compatibilidade com versões mais antigas do MySQL.

Tabelas que usam o formato de linha `REDUNDANTE` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (`VARCHAR`, `VARBINARY`, e os tipos `BLOB` e `TEXT`) no registro de índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maior ou igual a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como é o caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e pode haver economia no I/O, pois o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós da árvore B fiquem cheios de dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham poucos registros, tornando o índice como um todo menos eficiente do que se os registros fossem mais curtos ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento do Formato de Linha REDUNDANTE

O formato de linha `REDUNDANTE` tem as seguintes características de armazenamento:

* Cada registro de índice contém um cabeçalho de 6 bytes. O cabeçalho é usado para vincular registros consecutivos e para bloqueio em nível de linha.

* Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

* Se não for definida uma chave primária para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

* Cada registro de índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário.

* Um registro contém um ponteiro para cada campo do registro. Se o comprimento total dos campos em um registro for menor que 128 bytes, o ponteiro é de um byte; caso contrário, são dois bytes. O conjunto de ponteiros é chamado de diretório do registro. A área onde os ponteiros apontam é a parte de dados do registro.

* Internamente, colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas no formato de comprimento fixo. Espaços finais não são truncados de colunas `VARCHAR`.

* Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

* Um valor `NULL` em SQL reserva um ou dois bytes no diretório do registro. Um valor `NULL` em SQL reserva zero bytes na parte de dados do registro se armazenado em uma coluna de comprimento variável. Para uma coluna de comprimento fixo, o comprimento fixo da coluna é reservado na parte de dados do registro. Reservar espaço fixo para valores `NULL` permite que as colunas sejam atualizadas in loco de valores `NULL` para valores não `NULL` sem causar fragmentação da página de índice.

### Formato de Linha COMPACT

O formato de linha `COMPACT` reduz o espaço de armazenamento da linha em cerca de 20% em comparação com o formato de linha `REDUNDANT`, ao custo de aumentar o uso da CPU para algumas operações. Se sua carga de trabalho for típica e limitada pelas taxas de acerto de cache e pela velocidade do disco, o formato `COMPACT` provavelmente será mais rápido. Se a carga de trabalho for limitada pela velocidade da CPU, o formato compacto pode ser mais lento.

As tabelas que usam o formato de linha `COMPACT` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (`VARCHAR`, `VARBINARY`, e os tipos `BLOB` e `TEXT`) no registro do índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e pode haver economia no I/O, pois o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós da árvore B fiquem cheios de dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham muito poucas linhas, tornando o índice como um todo menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento do Formato de Linha COMPACT

O formato de linha `COMPACT` tem as seguintes características de armazenamento:

* Cada registro de índice contém um cabeçalho de 5 bytes que pode ser precedido por um cabeçalho de comprimento variável. O cabeçalho é usado para vincular registros consecutivos e para bloqueio em nível de linha.

* A parte de comprimento variável do cabeçalho do registro contém um vetor de bits para indicar colunas `NULL`. Se o número de colunas no índice que podem ser `NULL` for *`N`*, o vetor de bits ocupa `CEILING(N/8)` bytes. (Por exemplo, se houver de 9 a 16 colunas que podem ser `NULL`, o vetor de bits usa dois bytes.) As colunas que são `NULL` não ocupam espaço além do bit neste vetor. A parte de comprimento variável do cabeçalho também contém as comprimentos das colunas de comprimento variável. Cada comprimento ocupa um ou dois bytes, dependendo do comprimento máximo da coluna. Se todas as colunas no índice forem `NOT NULL` e tiverem um comprimento fixo, o cabeçalho do registro não tem parte de comprimento variável.

* Para cada campo de comprimento variável não `NULL`, o cabeçalho do registro contém o comprimento da coluna em um ou dois bytes. Dois bytes são necessários apenas se parte da coluna for armazenada externamente em páginas de sobreposição ou se o comprimento máximo exceder 255 bytes e o comprimento real exceder 127 bytes. Para uma coluna armazenada externamente, o comprimento de 2 bytes indica o comprimento da parte armazenada internamente mais o ponteiro de 20 bytes para a parte armazenada externamente. A parte interna é de 768 bytes, então o comprimento é 768+20. O ponteiro de 20 bytes armazena o verdadeiro comprimento da coluna.

* O cabeçalho do registro é seguido pelos conteúdos de dados das colunas não `NULL`.

* Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

* Se nenhuma chave primária for definida para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

* Cada registro de índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário. Se alguma das colunas da chave primária tiver comprimento variável, o cabeçalho do registro para cada índice secundário terá uma parte de comprimento variável para registrar seus comprimentos, mesmo que o índice secundário seja definido em colunas de comprimento fixo.

* Internamente, para conjuntos de caracteres de comprimento não variável, colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas em um formato de comprimento fixo.

Espaços finais não são truncados de colunas `VARCHAR`.

* Internamente, para conjuntos de caracteres de comprimento variável, como `utf8mb3` e `utf8mb4`, o `InnoDB` tenta armazenar `CHAR(N)` em *`N`* bytes, cortando espaços finais. Se o comprimento em bytes de um valor de coluna `CHAR(N)` exceder *`N`* bytes, os espaços finais são cortados para um máximo do comprimento em bytes do valor da coluna. O comprimento máximo de uma coluna `CHAR(N)` é o comprimento máximo em bytes de caracteres × *`N`*.

* Um mínimo de *`N`* bytes é reservado para `CHAR(N)`. Reservar o espaço mínimo *`N`* em muitos casos permite que as atualizações de coluna sejam feitas in loco sem causar fragmentação das páginas do índice. Em comparação, as colunas `CHAR(N)` ocupam o comprimento máximo em bytes de caracteres × *`N`* ao usar o formato de linha `REDUNDANT`.

Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo em bytes do conjunto de caracteres for maior que 3, como é o caso do `utf8mb4`.

### Formato de Linha DINÂMICO

O formato de linha `DINÂMICO` oferece as mesmas características de armazenamento que o formato de linha `COMPACT`, mas adiciona capacidades de armazenamento aprimoradas para colunas de comprimento variável longo e suporta grandes prefixos de chave de índice.

Quando uma tabela é criada com `ROW_FORMAT=DYNAMIC`, o `InnoDB` pode armazenar valores de coluna de comprimento variável longo (para os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT`) totalmente fora da página, com o registro do índice agrupado contendo apenas um ponteiro de 20 bytes para a página de overflow. Campos de comprimento fixo maiores ou iguais a 768 bytes são codificados como campos de comprimento variável. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se as colunas são armazenadas fora da página, isso depende do tamanho da página e do tamanho total da linha. Quando uma linha é muito longa, as colunas mais longas são escolhidas para armazenamento fora da página até que o registro do índice agrupado se encaixe na página da árvore B. Colunas `TEXT` e `BLOB` que são menores ou iguais a 40 bytes são armazenadas em linha.

O formato de linha `DYNAMIC` mantém a eficiência de armazenar toda a linha no nó do índice se ela cabe (como os formatos `COMPACT` e `REDUNDANT`), mas o formato de linha `DYNAMIC` evita o problema de preencher os nós da árvore B com um grande número de bytes de dados de colunas longas. O formato de linha `DYNAMIC` é baseado na ideia de que, se uma parte de um valor de dados longo for armazenada fora da página, geralmente é mais eficiente armazenar todo o valor fora da página. Com o formato `DYNAMIC`, as colunas mais curtas provavelmente permanecerão no nó da árvore B, minimizando o número de páginas de overflow necessárias para uma determinada linha.

O formato de linha `DYNAMIC` suporta prefixos de chave de índice de até 3072 bytes.

Tabelas que utilizam o formato de linha `DYNAMIC` podem ser armazenadas no espaço de tabelas do sistema, espaços de tabelas por arquivo e espaços de tabelas gerais. Para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema, desative `innodb_file_per_table` e use uma declaração `CREATE TABLE` ou `ALTER TABLE` regular, ou use a opção `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE`. A variável `innodb_file_per_table` não é aplicável a espaços de tabelas gerais, nem é aplicável ao usar a opção `TABLESPACE [=] innodb_system` para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema.

#### Características de Armazenamento do Formato de Linha `DYNAMIC`

O formato de linha `DYNAMIC` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha `COMPACT`.

### Formato de Linha COMPRESSED

O formato de linha `COMPRESSED` oferece as mesmas características de armazenamento e capacidades que o formato de linha `DYNAMIC`, mas adiciona suporte para compressão de dados de tabela e índice.

O formato de linha `COMPRESSED` usa detalhes internos semelhantes para armazenamento fora de página como o formato de linha `DYNAMIC`, com considerações adicionais de armazenamento e desempenho de dados de tabela e índice sendo comprimidos e usando tamanhos de página menores. Com o formato de linha `COMPRESSED`, a opção `KEY_BLOCK_SIZE` controla quanto dos dados da coluna são armazenados no índice agrupado e quanto são colocados em páginas de overflow. Para mais informações sobre o formato de linha `COMPRESSED`, consulte Seção 17.9, “Compressão de Tabela e Página do InnoDB”.

O formato de linha `COMPRESSED` suporta prefixos de chaves de índice de até 3072 bytes.

Tabelas que utilizam o formato de linha `COMPRESSED` podem ser criadas em espaços de tabelas por arquivo ou espaços de tabelas gerais. O espaço de tabelas do sistema não suporta o formato de linha `COMPRESSED`. Para armazenar uma tabela `COMPRESSED` em um espaço de tabelas por arquivo, a variável `innodb_file_per_table` deve ser habilitada. A variável `innodb_file_per_table` não é aplicável a espaços de tabelas gerais. Os espaços de tabelas gerais suportam todos os formatos de linha com a ressalva de que tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabelas gerais devido aos tamanhos diferentes das páginas físicas. Para obter mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

#### Características de Armazenamento do Formato de Linha Compactada

O formato de linha `COMPRESSED` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha COMPACT.

### Definindo o Formato de Linha de uma Tabela

O formato de linha padrão para tabelas `InnoDB` é definido pela variável `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` da tabela não é definida explicitamente ou quando `ROW_FORMAT=DEFAULT` é especificado.

O formato de linha de uma tabela pode ser definido explicitamente usando a opção `ROW_FORMAT` da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Por exemplo:

```
CREATE TABLE t1 (c1 INT) ROW_FORMAT=DYNAMIC;
```

Uma configuração de `ROW_FORMAT` definida explicitamente substitui o formato de linha padrão. Especificar `ROW_FORMAT=DEFAULT` é equivalente ao uso do padrão implícito.

A variável `innodb_default_row_format` pode ser definida dinamicamente:

```
mysql> SET GLOBAL innodb_default_row_format=DYNAMIC;
```

As opções válidas para `innodb_default_row_format` incluem `DYNAMIC`, `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no espaço de tabela do sistema, não pode ser definido como padrão. Ele só pode ser especificado explicitamente em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Tentar definir a variável `innodb_default_row_format` para `COMPRESSED` retorna um erro:

```
mysql> SET GLOBAL innodb_default_row_format=COMPRESSED;
ERROR 1231 (42000): Variable 'innodb_default_row_format'
can't be set to the value of 'COMPRESSED'
```

Tabelas recém-criadas usam o formato de linha definido pela variável `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usada. Por exemplo, as seguintes declarações `CREATE TABLE` usam o formato de linha definido pela variável `innodb_default_row_format`.

```
CREATE TABLE t1 (c1 INT);
```

```
CREATE TABLE t2 (c1 INT) ROW_FORMAT=DEFAULT;
```

Quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usada, uma operação que reconstrui uma tabela silenciosamente altera o formato de linha da tabela para o formato definido pela variável `innodb_default_row_format`.

As operações de reconstrução de tabela incluem operações `ALTER TABLE` que usam `ALGORITHM=COPY` ou `ALGORITHM=INPLACE` onde a reconstrução da tabela é necessária. Veja a Seção 17.12.1, “Operações DDL Online” para mais informações. `OPTIMIZE TABLE` também é uma operação de reconstrução de tabela.

O exemplo seguinte demonstra uma operação de reconstrução de tabela que silenciosamente altera o formato de linha de uma tabela criada sem um formato de linha definido explicitamente.

```
mysql> SELECT @@innodb_default_row_format;
+-----------------------------+
| @@innodb_default_row_format |
+-----------------------------+
| dynamic                     |
+-----------------------------+

mysql> CREATE TABLE t1 (c1 INT);

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME LIKE 'test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 54
         NAME: test/t1
         FLAG: 33
       N_COLS: 4
        SPACE: 35
   ROW_FORMAT: Dynamic
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single

mysql> SET GLOBAL innodb_default_row_format=COMPACT;

mysql> ALTER TABLE t1 ADD COLUMN (c2 INT);

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME LIKE 'test/t1' \G
*************************** 1. row ***************************
     TABLE_ID: 55
         NAME: test/t1
         FLAG: 1
       N_COLS: 5
        SPACE: 36
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: Single
```

Considere os seguintes problemas potenciais antes de alterar o formato de linha de tabelas existentes de `REDUNDANT` ou `COMPACT` para `DYNAMIC`.

* Os formatos de linha `REDUNDANTE` e `COMPACT` suportam um comprimento máximo de prefixo de chave de índice de 767 bytes, enquanto os formatos de linha `DINÂMICO` e `COMPRESSADO` suportam um comprimento de prefixo de chave de índice de 3072 bytes. Em um ambiente de replicação, se a variável `innodb_default_row_format` for definida como `DINÂMICO` no servidor de origem e como `COMPACT` na replica, a seguinte instrução DDL, que não define explicitamente um formato de linha, terá sucesso no servidor de origem, mas falhará na replica:

  ```
  CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 VARCHAR(5000), KEY i1(c2(3070)));
  ```

  Para informações relacionadas, consulte a Seção 17.21, “Limites do InnoDB”.

* A importação de uma tabela que não define explicitamente um formato de linha resulta em um erro de desajuste do esquema se a configuração `innodb_default_row_format` no servidor de origem for diferente da configuração no servidor de destino. Para mais informações, consulte a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

### Determinando o Formato de Linha de uma Tabela

Para determinar o formato de linha de uma tabela, use `SHOW TABLE STATUS`:

```
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
      Collation: utf8mb4_0900_ai_ci
       Checksum: NULL
 Create_options:
        Comment:
```

Alternativamente, consulte a tabela do Esquema de Informações `INNODB_TABLES`:

```
mysql> SELECT NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='test1/t1';
+----------+------------+
| NAME     | ROW_FORMAT |
+----------+------------+
| test1/t1 | Dynamic    |
+----------+------------+
```