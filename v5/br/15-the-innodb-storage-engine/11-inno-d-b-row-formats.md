## 14.11 Formatos de Linhas do InnoDB

O formato de linha de uma tabela determina como suas linhas são armazenadas fisicamente, o que, por sua vez, pode afetar o desempenho de consultas e operações de manipulação de dados de massa (DML). À medida que mais linhas cabem em uma única página de disco, as consultas e buscas de índice podem funcionar mais rápido, é necessário menos memória cache no pool de buffer e menos I/O é necessário para gravar valores atualizados.

Os dados de cada tabela são divididos em páginas. As páginas que compõem cada tabela são organizadas em uma estrutura de dados em forma de árvore chamada índice B-tree. Os dados da tabela e os índices secundários usam esse tipo de estrutura. O índice B-tree que representa toda a tabela é conhecido como índice agrupado, que é organizado de acordo com as colunas da chave primária. Os nós de uma estrutura de dados de índice B-tree contêm os valores de todas as colunas da linha. Os nós de uma estrutura de índice secundário contêm os valores das colunas do índice e das colunas da chave primária.

Colunas de comprimento variável são uma exceção à regra de que os valores das colunas são armazenados em nós de índice de árvore B. Colunas de comprimento variável que são muito longas para caber em uma página de árvore B são armazenadas em páginas de disco alocadas separadamente, chamadas páginas de sobreposição. Tais colunas são referidas como colunas fora da página. Os valores das colunas fora da página são armazenados em listas de ponteiros simples de páginas de sobreposição, com cada coluna tendo sua própria lista de uma ou mais páginas de sobreposição. Dependendo do comprimento da coluna, todos ou um prefixo dos valores das colunas de comprimento variável são armazenados na árvore B para evitar desperdício de armazenamento e ter que ler uma página separada.

O mecanismo de armazenamento `InnoDB` suporta quatro formatos de linha: `REDUNDANT`, `COMPACT`, `DYNAMIC` e `COMPRESSED`.

**Tabela 14.9 Resumo do Formato de Linha InnoDB**

<table summary="Visão geral dos formatos de linha do InnoDB, incluindo uma descrição, recursos suportados e tipos de espaço de tabela suportados."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Formato de linha</th> <th>Características de Armazenamento Compacto</th> <th>Armazenamento de Colunas com Variável Comprimento Aprimorado</th> <th>Suporte a prefixo de chave de índice grande</th> <th>Suporte de compressão</th> <th>Tipos de Espaço de Tabela suportados</th> <th>Formato de arquivo exigido</th> </tr></thead><tbody><tr> <th>[[<code>REDUNDANT</code>]]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>sistema, arquivo por tabela, geral</td> <td>Antílope ou Barracuda</td> </tr><tr> <th>[[<code>COMPACT</code>]]</th> <td>Sim</td> <td>Não</td> <td>Não</td> <td>Não</td> <td>sistema, arquivo por tabela, geral</td> <td>Antílope ou Barracuda</td> </tr><tr> <th>[[<code>DYNAMIC</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>sistema, arquivo por tabela, geral</td> <td>Barracuda</td> </tr><tr> <th>[[<code>COMPRESSED</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>arquivo por tabela, geral</td> <td>Barracuda</td> </tr></tbody></table>

Os tópicos a seguir descrevem as características de armazenamento de formato de linha e como definir e determinar o formato de linha de uma tabela.

- Formato de linha redundante REDUNDANT
- Formato de linha compacta
- Formato Dinâmico de Linha
- Formato de linha compactada
- Definindo o Formato da Linha de uma Tabela
- Determinando o Formato da Linha de uma Tabela

### Formato de linha redundante REDUNDANT

O formato `REDUNDANT` oferece compatibilidade com versões mais antigas do MySQL.

O formato da linha `REDUNDANT` é suportado pelos formatos de arquivo `InnoDB` (`Antelope` e `Barracuda`). Para mais informações, consulte a Seção 14.10, “Gerenciamento de Formatos de Arquivo InnoDB”.

As tabelas que usam o formato de linha `REDUNDANT` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` e `TEXT`) no registro do índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e pode haver economias no I/O, pois o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós da árvore B fiquem cheios de dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham poucas linhas, tornando o índice como um todo menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento de Formato de Linha Redundante

O formato de linha `REDUNDANT` tem as seguintes características de armazenamento:

- Cada registro de índice contém um cabeçalho de 6 bytes. O cabeçalho é usado para vincular registros consecutivos e para o bloqueio em nível de linha.

- Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

- Se não for definido uma chave primária para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

- Cada registro do índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário.

- Um registro contém um ponteiro para cada campo do registro. Se o comprimento total dos campos em um registro for menor que 128 bytes, o ponteiro é de um byte; caso contrário, são dois bytes. O conjunto de ponteiros é chamado de diretório de registro. A área onde os ponteiros apontam é a parte de dados do registro.

- Internamente, colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas no formato de comprimento fixo. Espaços finais não são truncados de colunas `VARCHAR`.

- Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

- Um valor `NULL` em SQL reserva um ou dois bytes no diretório do registro. Um valor `NULL` em SQL reserva zero bytes na parte de dados do registro se armazenado em uma coluna de comprimento variável. Para uma coluna de comprimento fixo, o comprimento fixo da coluna é reservado na parte de dados do registro. Reservar espaço fixo para valores `NULL` permite que as colunas sejam atualizadas in loco de valores `NULL` para valores não `NULL` sem causar fragmentação da página de índice.

### Formato de linha compacta

O formato de linha `COMPACT` reduz o espaço de armazenamento de linhas em cerca de 20% em comparação com o formato de linha `REDUNDANT`, com o custo de aumentar o uso da CPU para algumas operações. Se sua carga de trabalho é típica e é limitada pelas taxas de acerto de cache e pela velocidade do disco, o formato `COMPACT` provavelmente será mais rápido. Se a carga de trabalho for limitada pela velocidade da CPU, o formato compacto pode ser mais lento.

O formato de linha `COMPACT` é suportado pelos formatos de arquivo `InnoDB` (`Antelope` e `Barracuda`). Para mais informações, consulte a Seção 14.10, “Gerenciamento de Formatos de Arquivo InnoDB”.

As tabelas que usam o formato de linha `COMPACT` armazenam os primeiros 768 bytes dos valores de coluna de comprimento variável (`VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` e `TEXT`) no registro do índice dentro do nó da árvore B, com o restante armazenado em páginas de sobreposição. Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como colunas de comprimento variável, que podem ser armazenadas fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se o valor de uma coluna for de 768 bytes ou menos, uma página de sobreposição não é usada, e pode haver economias no I/O, pois o valor é armazenado inteiramente no nó da árvore B. Isso funciona bem para valores de coluna `BLOB` relativamente curtos, mas pode fazer com que os nós da árvore B fiquem cheios de dados em vez de valores de chave, reduzindo sua eficiência. Tabelas com muitas colunas `BLOB` podem fazer com que os nós da árvore B fiquem muito cheios e contenham poucas linhas, tornando o índice como um todo menos eficiente do que se as linhas fossem mais curtas ou os valores das colunas fossem armazenados fora da página.

#### Características de Armazenamento do Formato de Linha COMPACT

O formato de linha `COMPACT` tem as seguintes características de armazenamento:

- Cada registro de índice contém um cabeçalho de 5 bytes que pode ser precedido por um cabeçalho de comprimento variável. O cabeçalho é usado para vincular registros consecutivos e para o bloqueio em nível de linha.

- A parte de comprimento variável do cabeçalho do registro contém um vetor de bits para indicar colunas `NULL`. Se o número de colunas no índice que podem ser `NULL` for *`N`*, o vetor de bits ocupa `CEILING(N/8)` bytes. (Por exemplo, se houver de 9 a 16 colunas que podem ser `NULL`, o vetor de bits usa dois bytes.) As colunas que são `NULL` não ocupam espaço além do bit neste vetor. A parte de comprimento variável do cabeçalho também contém as comprimentos das colunas de comprimento variável. Cada comprimento ocupa um ou dois bytes, dependendo do comprimento máximo da coluna. Se todas as colunas no índice forem `NOT NULL` e tiverem um comprimento fixo, o cabeçalho do registro não tem parte de comprimento variável.

- Para cada campo de comprimento variável que não é `NULL`, o cabeçalho do registro contém o comprimento da coluna em um ou dois bytes. Dois bytes são necessários apenas se parte da coluna for armazenada externamente em páginas de sobreposição ou se o comprimento máximo exceder 255 bytes e o comprimento real exceder 127 bytes. Para uma coluna armazenada externamente, o comprimento de 2 bytes indica o comprimento da parte armazenada internamente mais o ponteiro de 20 bytes para a parte armazenada externamente. A parte interna é de 768 bytes, então o comprimento é 768 + 20. O ponteiro de 20 bytes armazena o verdadeiro comprimento da coluna.

- O cabeçalho do registro é seguido pelos conteúdos dos dados das colunas que não são `NULL`.

- Os registros no índice agrupado contêm campos para todas as colunas definidas pelo usuário. Além disso, há um campo de ID de transação de 6 bytes e um campo de ponteiro de rolagem de 7 bytes.

- Se não for definido uma chave primária para uma tabela, cada registro do índice agrupado também contém um campo de ID de linha de 6 bytes.

- Cada registro de índice secundário contém todas as colunas da chave primária definidas para a chave do índice agrupado que não estão no índice secundário. Se alguma das colunas da chave primária tiver comprimento variável, o cabeçalho do registro para cada índice secundário terá uma parte de comprimento variável para registrar seus comprimentos, mesmo que o índice secundário seja definido em colunas de comprimento fixo.

- Internamente, para conjuntos de caracteres de comprimento não variável, colunas de caracteres de comprimento fixo, como `CHAR(10)`, são armazenadas em um formato de comprimento fixo.

  Os espaços em branco finais não são truncados de colunas `VARCHAR`.

- Internamente, para conjuntos de caracteres de comprimento variável, como `utf8mb3` e `utf8mb4`, o `InnoDB` tenta armazenar `CHAR(N)` em *`N`* bytes, removendo espaços em branco finais. Se o comprimento em bytes de um valor de coluna `CHAR(N)` exceder *`N`* bytes, os espaços em branco finais são removidos para um comprimento mínimo do comprimento em bytes do valor da coluna. O comprimento máximo de uma coluna `CHAR(N)` é o comprimento máximo em bytes de um caractere × *`N`*.

  Um mínimo de *`N`* bytes é reservado para `CHAR(N)`. Reservar o espaço mínimo *`N`* em muitos casos permite que as atualizações de coluna sejam feitas in loco sem causar fragmentação da página de índice. Em comparação, as colunas `CHAR(N)` ocupam o máximo comprimento de byte de caractere × *`N`* ao usar o formato de linha `REDUNDANT`.

  Colunas de comprimento fixo maiores ou iguais a 768 bytes são codificadas como campos de comprimento variável, que podem ser armazenados fora da página. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

### Formato Dinâmico de Linha

O formato de linha `DINÂMICA` oferece as mesmas características de armazenamento que o formato de linha `COMPACT`, mas adiciona capacidades de armazenamento aprimoradas para colunas de comprimento variável longo e suporta grandes prefixos de chaves de índice.

O formato de arquivo Barracuda suporta o formato de linha `DYNAMIC`. Consulte a Seção 14.10, “Gerenciamento de Formato de Arquivo InnoDB”.

Quando uma tabela é criada com `ROW_FORMAT=DYNAMIC`, o `InnoDB` pode armazenar valores de coluna de comprimento variável longo (para os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT`) totalmente fora da página, com o registro do índice agrupado contendo apenas um ponteiro de 20 bytes para a página de excesso. Campos de comprimento fixo maiores ou iguais a 768 bytes são codificados como campos de comprimento variável. Por exemplo, uma coluna `CHAR(255)` pode exceder 768 bytes se o comprimento máximo de byte do conjunto de caracteres for maior que 3, como no caso do `utf8mb4`.

Se as colunas forem armazenadas fora da página, isso depende do tamanho da página e do tamanho total da linha. Quando uma linha é muito longa, as colunas mais longas são escolhidas para o armazenamento fora da página até que o registro do índice agrupado se encaixe na página da árvore B. Colunas `TEXT` e `BLOB` que têm menos de 40 bytes são armazenadas em linha.

O formato de linha `DINÂMICO` mantém a eficiência de armazenar toda a linha no nó do índice se ela cabe (assim como os formatos `COMPACT` e `REDUNDANTE`), mas o formato de linha `DINÂMICO` evita o problema de preencher os nós da árvore B com um grande número de bytes de dados de colunas longas. O formato de linha `DINÂMICO` é baseado na ideia de que, se uma parte de um valor de dados longo for armazenada fora da página, geralmente é mais eficiente armazenar todo o valor fora da página. Com o formato `DINÂMICO`, as colunas mais curtas provavelmente permanecerão no nó da árvore B, minimizando o número de páginas de excesso necessárias para uma determinada linha.

O formato de linha `DYNAMIC` suporta prefixos de chave de índice de até 3072 bytes. Esse recurso é controlado pela variável `innodb_large_prefix`, que está habilitada por padrão. Consulte a descrição da variável `innodb_large_prefix` para obter mais informações.

Tabelas que utilizam o formato de linha `DYNAMIC` podem ser armazenadas no espaço de tabelas do sistema, nos espaços de tabelas por arquivo e nos espaços de tabelas gerais. Para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema, desative `innodb_file_per_table` e use uma declaração regular de `CREATE TABLE` ou `ALTER TABLE`, ou use a opção `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE`. As variáveis `innodb_file_per_table` e `innodb_file_format` não são aplicáveis aos espaços de tabelas gerais, nem são aplicáveis quando se usa a opção `TABLESPACE [=] innodb_system` para armazenar tabelas `DYNAMIC` no espaço de tabelas do sistema.

#### Características de Armazenamento do Formato de Linha Dinâmico

O formato de linha `DINÂMICA` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha COMPACT.

### Formato de linha compactada

O formato de linha `COMPRESSED` oferece as mesmas características e capacidades de armazenamento que o formato de linha `DYNAMIC`, mas adiciona suporte para compressão de dados de tabela e índice.

O formato de arquivo Barracuda suporta o formato de linha `COMPRESSED`. Consulte a Seção 14.10, “Gerenciamento de Formato de Arquivo InnoDB”.

O formato de linha `COMPRESSED` utiliza detalhes internos semelhantes para o armazenamento fora da página, como o formato de linha `DYNAMIC`, com considerações adicionais de armazenamento e desempenho dos dados da tabela e do índice sendo comprimidos e usando tamanhos de página menores. Com o formato de linha `COMPRESSED`, a opção `KEY_BLOCK_SIZE` controla quanto dos dados da coluna são armazenados no índice agrupado e quanto é colocado em páginas de sobreposição. Para mais informações sobre o formato de linha `COMPRESSED`, consulte a Seção 14.9, “Compressão de Tabela e Página do InnoDB”.

O formato da linha `COMPRESSED` suporta prefixos de chave de índice de até 3072 bytes. Esse recurso é controlado pela variável `innodb_large_prefix`, que está habilitada por padrão. Consulte a descrição da variável `innodb_large_prefix` para obter mais informações.

Tabelas que utilizam o formato de linha `COMPRESSED` podem ser criadas em espaços de tabelas por arquivo ou espaços de tabelas gerais. O espaço de tabelas do sistema não suporta o formato de linha `COMPRESSED`. Para armazenar uma tabela `COMPRESSED` em um espaço de tabelas por arquivo, a variável `innodb_file_per_table` deve ser habilitada e `innodb_file_format` deve ser definida como `Barracuda`. As variáveis `innodb_file_per_table` e `innodb_file_format` não são aplicáveis a espaços de tabelas gerais. Os espaços de tabelas gerais suportam todos os formatos de linha, com a ressalva de que tabelas comprimidas e não comprimidas não podem coexistir no mesmo espaço de tabelas gerais devido aos tamanhos diferentes das páginas físicas. Para obter mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

#### Características de Armazenamento em Formato de Linha Compressa

O formato de linha `COMPRESSED` é uma variação do formato de linha `COMPACT`. Para características de armazenamento, consulte Características de Armazenamento do Formato de Linha COMPACT.

### Definindo o Formato da Linha de uma Tabela

O formato de linha padrão para tabelas `InnoDB` é definido pela variável `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` da tabela não é definida explicitamente ou quando `ROW_FORMAT=DEFAULT` é especificado.

O formato de linha de uma tabela pode ser definido explicitamente usando a opção `ROW_FORMAT` na instrução `CREATE TABLE` ou `ALTER TABLE`. Por exemplo:

```sql
CREATE TABLE t1 (c1 INT) ROW_FORMAT=DYNAMIC;
```

Uma configuração `ROW_FORMAT` explicitamente definida substitui o formato de linha padrão. Especificar `ROW_FORMAT=DEFAULT` é equivalente a usar o padrão implícito.

A variável `innodb_default_row_format` pode ser definida dinamicamente:

```sql
mysql> SET GLOBAL innodb_default_row_format=DYNAMIC;
```

As opções válidas para `innodb_default_row_format` incluem `DYNAMIC`, `COMPACT` e `REDUNDANT`. O formato de linha `COMPRESSED`, que não é suportado para uso no espaço de tabela do sistema, não pode ser definido como padrão. Ele só pode ser especificado explicitamente em uma instrução `CREATE TABLE` ou `ALTER TABLE`. Tentar definir a variável `innodb_default_row_format` para `COMPRESSED` retorna um erro:

```sql
mysql> SET GLOBAL innodb_default_row_format=COMPRESSED;
ERROR 1231 (42000): Variable 'innodb_default_row_format'
can't be set to the value of 'COMPRESSED'
```

Tabelas recém-criadas usam o formato de linha definido pela variável `innodb_default_row_format` quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usada. Por exemplo, os seguintes comandos `CREATE TABLE` usam o formato de linha definido pela variável `innodb_default_row_format`.

```sql
CREATE TABLE t1 (c1 INT);
```

```sql
CREATE TABLE t2 (c1 INT) ROW_FORMAT=DEFAULT;
```

Quando uma opção `ROW_FORMAT` não é especificada explicitamente, ou quando `ROW_FORMAT=DEFAULT` é usada, uma operação que reconstrui uma tabela silenciosamente altera o formato da linha da tabela para o formato definido pela variável `innodb_default_row_format`.

As operações de reconstrução de tabelas incluem operações `ALTER TABLE` que utilizam `ALGORITHM=COPY` ou `ALGORITHM=INPLACE` quando a reconstrução da tabela é necessária. Consulte a Seção 14.13.1, “Operações DDL Online” para obter mais informações. `OPTIMIZE TABLE` também é uma operação de reconstrução de tabela.

O exemplo a seguir demonstra uma operação de reconstrução de tabela que altera silenciosamente o formato da linha de uma tabela criada sem um formato de linha definido explicitamente.

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

Considere os seguintes problemas potenciais antes de alterar o formato da linha das tabelas existentes de `REDUNDANTE` ou `COMPACT` para `DINÂMICA`.

- Os formatos de linha `REDUNDANTE` e `COMPACT` suportam um comprimento máximo de prefixo de chave de índice de 767 bytes, enquanto os formatos de linha `DINÂMICA` e `COMPACT` suportam um comprimento de prefixo de chave de índice de 3072 bytes. Em um ambiente de replicação, se a variável `innodb_default_row_format` for definida como `DINÂMICA` na fonte e como `COMPACT` na replica, a seguinte instrução DDL, que não define explicitamente um formato de linha, terá sucesso na fonte, mas falhará na replica:

  ```sql
  CREATE TABLE t1 (c1 INT PRIMARY KEY, c2 VARCHAR(5000), KEY i1(c2(3070)));
  ```

  Para informações relacionadas, consulte a Seção 14.23, “Limites do InnoDB”.

- A importação de uma tabela que não define explicitamente um formato de linha resulta em um erro de incompatibilidade de esquema se o ajuste `innodb_default_row_format` no servidor de origem for diferente do ajuste no servidor de destino. Para mais informações, consulte a Seção 14.6.1.3, “Importando tabelas InnoDB”.

### Determinando o Formato da Linha de uma Tabela

Para determinar o formato da linha de uma tabela, use `SHOW TABLE STATUS`:

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

Alternativamente, consulte a tabela do esquema de informações `INNODB_SYS_TABLES`:

```sql
mysql> SELECT NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE NAME='test1/t1';
+----------+------------+
| NAME     | ROW_FORMAT |
+----------+------------+
| test1/t1 | Dynamic    |
+----------+------------+
```
