## 17.10 Formatos de Linha InnoDB

O formato de linha de uma tabela determina como suas linhas são armazenadas fisicamente, o que, por sua vez, pode afetar o desempenho de consultas e operações de manipulação de dados. À medida que mais linhas cabem em uma única página de disco, consultas e buscas de índice podem funcionar mais rápido, menos memória de cache é necessária no buffer pool e menos I/O é necessário para escrever valores atualizados.

Os dados de cada tabela são divididos em páginas. As páginas que compõem cada tabela são organizadas em uma estrutura de dados em forma de árvore chamada índice B-tree. Os dados da tabela e os índices secundários utilizam esse tipo de estrutura. O índice B-tree que representa uma tabela inteira é conhecido como índice agrupado, que é organizado de acordo com as colunas da chave primária. Os nós de uma estrutura de dados de índice agrupado contêm os valores de todas as colunas da linha. Os nós de uma estrutura de índice secundário contêm os valores das colunas do índice e das colunas da chave primária.

Colunas de comprimento variável são uma exceção à regra de que os valores das colunas são armazenados em nós de índice de árvore B. Colunas de comprimento variável que são muito longas para caber em uma página de árvore B são armazenadas em páginas de disco alocadas separadamente, chamadas páginas de overflow. Tais colunas são referidas como colunas fora da página. Os valores das colunas fora da página são armazenados em listas de listas de páginas de overflow, com cada uma dessas colunas tendo sua própria lista de uma ou mais páginas de overflow. Dependendo do comprimento da coluna, todos ou um prefixo dos valores das colunas de comprimento variável são armazenados na árvore B para evitar desperdício de armazenamento e ter que ler uma página separada.

O motor de armazenamento `InnoDB` suporta quatro formatos de linha: `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`.

**Tabela 17.15 Visão geral do formato de linha InnoDB**

<table summary="Overview of InnoDB row formats incuding a description, supported features, and supported tablespace types."><col style="width: 10%"/><col style="width: 18%"/><col style="width: 18%"/><col style="width: 18%"/><col style="width: 18%"/><col style="width: 18%"/><thead><tr> <th scope="col">Formato de linha</th> <th scope="col">Características de Armazenamento Compacto</th> <th scope="col">Armazenamento de coluna com comprimento variável aprimorado</th> <th scope="col">Suporte para prefixo de chave de índice grande</th> <th scope="col">Suporte de compressão</th> <th scope="col">Tipos de espaço de tabela suportados</th> </tr></thead><tbody><tr> <th scope="row"><code>REDUNDANT</code></th> <td>No</td> <td>No</td> <td>No</td> <td>No</td> <td>system, file-per-table, general</td> </tr><tr> <th scope="row"><code>COMPACT</code></th> <td>Yes</td> <td>No</td> <td>No</td> <td>No</td> <td>system, file-per-table, general</td> </tr><tr> <th scope="row"><code>DYNAMIC</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> <td>system, file-per-table, general</td> </tr><tr> <th scope="row"><code>COMPRESSED</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>file-per-table, general</td> </tr></tbody></table>

Os tópicos que seguem descrevem as características de armazenamento de formato de linha e como definir e determinar o formato de linha de uma tabela.

* Formato de linha redundante
* Formato de linha compacta
* Formato de linha dinâmico
* Formato de linha comprimida
* Definindo o formato de linha de uma tabela
* Determinando o formato de linha de uma tabela

### Formato de linha redundante

O formato `REDUNDANT` oferece compatibilidade com versões mais antigas do MySQL.

As tabelas que utilizam o formato da linha `REDUNDANT` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (os tipos `VARCHAR`, `VARBINARY` e `BLOB` e `TEXT` e `TEXT`), no registro do índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e algumas economias em I/O podem resultar, uma vez que o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores relativamente curtos da coluna `BLOB`, mas pode fazer com que os nós da árvore B sejam preenchidos com dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham poucas linhas, tornando o índice como um todo menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento de Formato de Linha Redundante

O formato da linha `REDUNDANT` tem as seguintes características de armazenamento:

* Cada registro de índice contém um cabeçalho de 6 bytes. O cabeçalho é usado para vincular registros consecutivos e para bloqueio em nível de linha.

* Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

* Se não for definida uma chave primária para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

* Cada registro do índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário.

* Um registro contém um ponteiro para cada campo do registro. Se o comprimento total dos campos em um registro for menor que 128 bytes, o ponteiro é um byte; caso contrário, dois bytes. O conjunto de ponteiros é chamado de diretório de registro. A área onde os ponteiros apontam é a parte de dados do registro.

* Internamente, as colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas em formato de comprimento fixo. Espaços finais não são truncados das colunas `VARCHAR`.

Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

* Um valor SQL `NULL` reserva um ou dois bytes no diretório do registro. Um valor SQL `NULL` reserva zero bytes na parte de dados do registro se armazenado em uma coluna de comprimento variável. Para uma coluna de comprimento fixo, o comprimento fixo da coluna é reservado na parte de dados do registro. Reservar espaço fixo para valores `NULL` permite que as colunas sejam atualizadas in loco de `NULL` para valores não `NULL` sem causar fragmentação da página de índice.

### Formato de linha compacta

O formato de linha `COMPACT` reduz o espaço de armazenamento de linha em cerca de 20% em comparação com o formato de linha `REDUNDANT`, ao custo de aumentar o uso da CPU para algumas operações. Se sua carga de trabalho é típica e limitada pelas taxas de acerto de cache e velocidade do disco, o formato `COMPACT` provavelmente será mais rápido. Se a carga de trabalho é limitada pela velocidade da CPU, o formato compacto pode ser mais lento.

As tabelas que utilizam o formato da linha `COMPACT` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` e `TEXT`) no registro do índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e algumas economias em I/O podem resultar, uma vez que o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores relativamente curtos da coluna `BLOB`, mas pode fazer com que os nós da árvore B sejam preenchidos com dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham poucas linhas, tornando o índice como um todo menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento do Formato de Linha COMPACT

O formato de linha `COMPACT` tem as seguintes características de armazenamento:

* Cada registro de índice contém um cabeçalho de 5 bytes que pode ser precedido por um cabeçalho de comprimento variável. O cabeçalho é usado para vincular registros consecutivos e para bloqueio em nível de linha.

* A parte de comprimento variável do cabeçalho do registro contém um vetor de bits para indicar as colunas `NULL`. Se o número de colunas no índice que podem ser `NULL` é *`N`, o vetor de bits ocupa `CEILING(N/8)` bytes. (Por exemplo, se houver de 9 a 16 colunas que podem ser `NULL`, o vetor de bits usa dois bytes. Colunas que são `NULL` não ocupam espaço além do bit neste vetor. A parte de comprimento variável do cabeçalho também contém as comprimentos das colunas de comprimento variável. Cada comprimento leva um ou dois bytes, dependendo do comprimento máximo da coluna. Se todas as colunas no índice são `NOT NULL` e têm um comprimento fixo, o cabeçalho do registro não tem parte de comprimento variável.

* Para cada campo de comprimento variável não `NULL` da variável, o cabeçalho do registro contém o comprimento da coluna em um ou dois bytes. Dois bytes são necessários apenas se parte da coluna for armazenada externamente em páginas de overflow ou se o comprimento máximo excede 255 bytes e o comprimento real excede 127 bytes. Para uma coluna armazenada externamente, o comprimento de 2 bytes indica o comprimento da parte armazenada internamente mais o ponteiro de 20 bytes para a parte armazenada externamente. A parte interna é de 768 bytes, então o comprimento é 768 + 20. O ponteiro de 20 bytes armazena o verdadeiro comprimento da coluna.

* O cabeçalho do registro é seguido pelos conteúdos de dados das colunas que não são `NULL`.

* Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

* Se não for definida uma chave primária para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

* Cada registro do índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário. Se alguma das colunas da chave primária tiver comprimento variável, o cabeçalho do registro para cada índice secundário terá uma parte de comprimento variável para registrar seus comprimentos, mesmo que o índice secundário seja definido em colunas de comprimento fixo.

* Internamente, para conjuntos de caracteres de comprimento não variável, colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas em um formato de comprimento fixo.

Os espaços finais não são truncados das colunas `VARCHAR`.

* Internamente, para conjuntos de caracteres de comprimento variável, como `utf8mb3` e `utf8mb4`, `InnoDB` tenta armazenar `CHAR(N)` em *`N`* bytes, eliminando espaços finais. Se o comprimento em bytes de um valor de coluna `CHAR(N)` exceder *`N`* bytes, os espaços finais são eliminados até um máximo do comprimento em bytes do valor da coluna. O comprimento máximo de uma coluna `CHAR(N)` é o comprimento em bytes máximo do caractere × *`N`*.

Um mínimo de *`N`* bytes é reservado para `CHAR(N)`. Reservar o espaço mínimo *`N`* em muitos casos permite que as atualizações de coluna sejam feitas in loco sem causar fragmentação da página de índice. Em comparação, as colunas `CHAR(N)` ocupam o comprimento máximo do byte de caracteres × *`N`* ao usar o formato de linha `REDUNDANT`.

Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

### Formato Dinâmico de Linha

O formato de linha `DYNAMIC` oferece as mesmas características de armazenamento que o formato de linha `COMPACT`, mas adiciona capacidades de armazenamento aprimoradas para colunas de comprimento variável e suporta grandes prefixos de chave de índice.

Quando uma tabela é criada com `ROW_FORMAT=DYNAMIC`, `InnoDB` pode armazenar valores de coluna de comprimento longo (para os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` e `TEXT` e `CHAR(255)` e `utf8mb4`), totalmente fora da página, com o registro do índice agrupado contendo apenas um ponteiro de 20 bytes para a página de overflow. Campos de comprimento fixo maiores ou iguais a 768 bytes são codificados como campos de comprimento variável. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo do byte do conjunto de caracteres for maior que 3, como é o caso de `utf8mb4`.

Se as colunas forem armazenadas fora da página, isso depende do tamanho da página e do tamanho total da linha. Quando uma linha é muito longa, as colunas mais longas são escolhidas para armazenamento fora da página até que o registro do índice agrupado se encaixe na página do B-tree. As colunas `TEXT` e `BLOB` que têm menos de ou igual a 40 bytes são armazenadas em linha.

O formato da linha `DYNAMIC` mantém a eficiência de armazenar toda a linha no nó do índice se ela se encaixar (assim como os formatos `COMPACT` e `REDUNDANT`), mas o formato da linha `DYNAMIC` evita o problema de preencher os nós da árvore B com um grande número de bytes de dados de colunas longas. O formato da linha `DYNAMIC` é baseado na ideia de que, se uma parte de um valor de dados longo for armazenada fora da página, geralmente é mais eficiente armazenar todo o valor fora da página. Com o formato `DYNAMIC`, é provável que as colunas mais curtas permaneçam no nó da árvore B, minimizando o número de páginas de overflow necessárias para uma determinada linha.

O formato da linha `DYNAMIC` suporta prefixos de chave de índice de até 3072 bytes.

Tabelas que utilizam o formato da linha `DYNAMIC` podem ser armazenadas no espaço de tabelas do sistema, em espaços de tabelas por arquivo e em espaços de tabelas gerais. Para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema, desative `innodb_file_per_table` e use uma declaração regular de `CREATE TABLE` ou `ALTER TABLE`, ou use a opção de tabela `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE`. A variável `innodb_file_per_table` não é aplicável a espaços de tabelas gerais, e também não é aplicável quando se usa a opção de tabela `TABLESPACE [=] innodb_system` para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema.

#### Características de Armazenamento de Formato de Linha Dinâmico

O formato da linha `DYNAMIC` é uma variação do formato da linha [[`COMPACT`]. Para características de armazenamento, consulte as Características de Armazenamento do Formato de Linha COMPACT.

### COMPRESSED Formato de linha

O formato de linha `COMPRESSED` oferece as mesmas características e capacidades de armazenamento que o formato de linha `DYNAMIC`, mas adiciona suporte para compressão de dados de tabela e índice.

O formato de linha `COMPRESSED` utiliza detalhes internos semelhantes para armazenamento fora da página, assim como o formato de linha `DYNAMIC`, com considerações adicionais de armazenamento e desempenho do banco de dados e dos dados do índice sendo comprimidos e utilizando tamanhos de página menores. Com o formato de linha `COMPRESSED`, a opção `KEY_BLOCK_SIZE` controla quanto dos dados da coluna são armazenados no índice agrupado e quanto é colocado em páginas de sobreposição. Para mais informações sobre o formato de linha `COMPRESSED`, consulte a Seção 17.9, “Compressão de Tabela e Página InnoDB”.

O formato da linha `COMPRESSED` suporta prefixos de chave de índice de até 3072 bytes.

Tabelas que utilizam o formato da linha `COMPRESSED` podem ser criadas em espaços de tabela por arquivo ou espaços de tabela gerais. O espaço de tabelas do sistema não suporta o formato da linha `COMPRESSED`. Para armazenar uma tabela `COMPRESSED` em um espaço de tabela por arquivo, a variável `innodb_file_per_table` deve ser habilitada. A variável `innodb_file_per_table` não é aplicável a espaços de tabela gerais. Espaços de tabela gerais suportam todos os formatos de linha, com a ressalva de que tabelas compactadas e não compactadas não podem coexistir no mesmo espaço de tabela geral devido aos tamanhos diferentes das páginas físicas. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabela Geral”.

#### Características de Armazenamento de Formato de Fila Compressa

O formato de linha `COMPRESSED` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte as Características de Armazenamento do Formato de Linha COMPACT.

### Definindo o Formato da Linha de uma Tabela

O formato de linha padrão para as tabelas `InnoDB` é definido pela variável `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção de tabela `ROW_FORMAT` não é definida explicitamente ou quando `ROW_FORMAT=DEFAULT` é especificado.

O formato de linha de uma tabela pode ser definido explicitamente usando a opção de tabela `ROW_FORMAT` em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Por exemplo:

```
CREATE TABLE t1 (c1 INT) ROW_FORMAT=DYNAMIC;
```

Um ajuste explicitamente definido `ROW_FORMAT` substitui o formato de linha padrão. Especificar `ROW_FORMAT=DEFAULT` é equivalente ao uso do padrão implícito.

A variável `innodb_default_row_format` pode ser definida dinamicamente:

```
mysql> SET GLOBAL innodb_default_row_format=DYNAMIC;
```

As opções válidas do `innodb_default_row_format` incluem `DYNAMIC`, `COMPACT` e `REDUNDANT`. O formato da linha `COMPRESSED`, que não é suportado para uso nos espaços de tabela do sistema, não pode ser definido como padrão. Ele só pode ser especificado explicitamente em uma declaração do `CREATE TABLE` ou `ALTER TABLE`. Tentar definir a variável `innodb_default_row_format` para `COMPRESSED` retorna um erro:

```
mysql> SET GLOBAL innodb_default_row_format=COMPRESSED;
ERROR 1231 (42000): Variable 'innodb_default_row_format'
can't be set to the value of 'COMPRESSED'
```

As tabelas recém-criadas usam o formato de linha definido pela variável `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usada. Por exemplo, as seguintes declarações `CREATE TABLE` usam o formato de linha definido pela variável `innodb_default_row_format`.

```
CREATE TABLE t1 (c1 INT);
```

```
CREATE TABLE t2 (c1 INT) ROW_FORMAT=DEFAULT;
```

Quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usado, uma operação que reconstrui uma tabela muda silenciosamente o formato da linha da tabela para o formato definido pela variável `innodb_default_row_format`.

As operações de reconstrução de tabela incluem as operações `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") que utilizam `ALGORITHM=COPY` ou `ALGORITHM=INPLACE` quando a reconstrução da tabela é necessária. Consulte a Seção 17.12.1, “Operações DDL Online”, para obter mais informações. `OPTIMIZE TABLE` também é uma operação de reconstrução de tabela.

O exemplo a seguir demonstra uma operação de reconstrução de tabela que muda silenciosamente o formato de linha de uma tabela criada sem um formato de linha explicitamente definido.

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

Considere os seguintes problemas potenciais antes de alterar o formato da linha das tabelas existentes de `REDUNDANT` ou `COMPACT` para `DYNAMIC`.

* Os formatos de linha `REDUNDANT` e `COMPACT` suportam um comprimento máximo de prefixo de chave de índice de 767 bytes, enquanto os formatos de linha `DYNAMIC` e `COMPRESSED` suportam um comprimento de prefixo de chave de índice de 3072 bytes. Em um ambiente de replicação, se a variável `innodb_default_row_format` for definida como `DYNAMIC` na fonte e definida como `COMPACT` na replica, a seguinte declaração DDL, que não define explicitamente um formato de linha, terá sucesso na fonte, mas falhará na replica:

  ```
  CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 VARCHAR(5000), KEY i1(c2(3070)));
  ```

Para informações relacionadas, consulte a Seção 17.22, “Limites do InnoDB”.

* A importação de uma tabela que não define explicitamente um formato de linha resulta em um erro de incompatibilidade de esquema se a configuração `innodb_default_row_format` no servidor de origem diferir da configuração no servidor de destino. Para mais informações, consulte a Seção 17.6.1.3, “Importando tabelas InnoDB”.

### Determinando o Formato da Linha de uma Tabela

Para determinar o formato da linha de uma tabela, use `SHOW TABLE STATUS`:

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

Alternativamente, consulte a tabela do esquema de informações `INNODB_TABLES`:

```
mysql> SELECT NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='test1/t1';
+----------+------------+
| NAME     | ROW_FORMAT |
+----------+------------+
| test1/t1 | Dynamic    |
+----------+------------+
```