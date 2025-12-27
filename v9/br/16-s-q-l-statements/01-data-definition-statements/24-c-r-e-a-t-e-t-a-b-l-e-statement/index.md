### 15.1.24 Instrução `CREATE TABLE`

15.1.24.1 Arquivos Criados com `CREATE TABLE`

15.1.24.2 Instrução `CREATE TEMPORARY TABLE`

15.1.24.3 Instrução `CREATE TABLE ... LIKE`

15.1.24.4 Instrução `CREATE TABLE ... SELECT`

15.1.24.5 Restrições de Chave Estrangeira

15.1.24.6 Restrições CHECK

15.1.24.7 Alterações Silenciosas de Especificação de Colunas

15.1.24.8 `CREATE TABLE` e Colunas Geradas

15.1.24.9 Índices Secundários e Colunas Geradas

15.1.24.10 Colunas Invisíveis

15.1.24.11 Chaves Primárias Geradas Invisíveis

15.1.24.12 Configuração das Opções de Comentário de `NDB`

```
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (create_definition,...)
    [table_options]
    [partition_options]

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    [(create_definition,...)]
    [table_options]
    [partition_options]
    [IGNORE | REPLACE]
    [AS] query_expression

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    { LIKE old_tbl_name | (LIKE old_tbl_name) }

create_definition: {
    col_name column_definition
  | {INDEX | KEY} [index_name] [index_type] (key_part,...)
      [index_option] ...
  | {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | check_constraint_definition
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT {literal | (expr)} ]
      [VISIBLE | INVISIBLE]
      [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [ENGINE_ATTRIBUTE [=] 'string']
      [SECONDARY_ENGINE_ATTRIBUTE [=] 'string']
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
      [check_constraint_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [VISIBLE | INVISIBLE]
      [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
      [check_constraint_definition]
}

data_type:
    (see Chapter 13, Data Types)

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  |ENGINE_ATTRIBUTE [=] 'string'
  |SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

check_constraint_definition:
    [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTOEXTEND_SIZE [=] value
  | AUTO_INCREMENT [=] value
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
  | ENGINE_ATTRIBUTE [=] 'string'
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | START TRANSACTION
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | tablespace_option
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    PARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list)
        | RANGE{(expr) | COLUMNS(column_list)}
        | LIST{(expr) | COLUMNS(column_list)} }
    [PARTITIONS num]
    [SUBPARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list) }
      [SUBPARTITIONS num]
    ]
    [(partition_definition [, partition_definition] ...)]

partition_definition:
    PARTITION partition_name
        [VALUES
            {LESS THAN {(expr | value_list) | MAXVALUE}
            |
            IN (value_list)}]
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]
        [(subpartition_definition [, subpartition_definition] ...)]

subpartition_definition:
    SUBPARTITION logical_name
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]

tablespace_option:
    TABLESPACE tablespace_name [STORAGE DISK]
  | [TABLESPACE tablespace_name] STORAGE MEMORY

query_expression:
    SELECT ...   (Some valid select or union statement)
```

A instrução `CREATE TABLE` cria uma tabela com o nome fornecido. Você deve ter o privilégio `CREATE` para a tabela.

Por padrão, as tabelas são criadas no banco de dados padrão, usando o mecanismo de armazenamento `InnoDB`. Um erro ocorre se a tabela já existir, se não houver um banco de dados padrão ou se o banco de dados não existir.

O MySQL não tem limite para o número de tabelas. O sistema de arquivos subjacente pode ter um limite para o número de arquivos que representam tabelas. Mecanismos de armazenamento específicos podem impor restrições específicas do mecanismo. `InnoDB` permite até 4 bilhões de tabelas.

Para obter informações sobre a representação física de uma tabela, consulte a Seção 15.1.24.1, “Arquivos Criados com `CREATE TABLE`”.

Existem vários aspectos da instrução `CREATE TABLE`, descritos nos seguintes tópicos nesta seção:

* Nome da Tabela
* Tabelas Temporárias
* Clonagem e Copiar Tabelas
* Tipos de Dados e Atributos de Colunas
* Índices, Chaves Estrangeiras e Restrições CHECK
* Opções da Tabela
* Partição da Tabela

O nome da tabela pode ser especificado como *`db_name.tbl_name`* para criar a tabela em um banco de dados específico. Isso funciona independentemente de existir um banco de dados padrão, assumindo que o banco de dados exista. Se você usar identificadores com aspas, aspas aspas os nomes do banco de dados e da tabela separadamente. Por exemplo, escreva `` `mydb`.`mytbl` ``, não `` `mydb.mytbl` ``.

As regras para nomes de tabelas permitidos estão descritas na Seção 11.2, “Nomes de Objetos do Esquema”.

* `IF NOT EXISTS`

  Previne um erro de ocorrer se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica à indicada pela instrução `CREATE TABLE`.

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Para mais informações, consulte a Seção 15.1.24.2, “Instrução CREATE TEMPORARY TABLE”.

#### Clonagem e Copiar de Tabelas

* `LIKE`

  Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

  ```
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

  Para mais informações, consulte a Seção 15.1.24.3, “Instrução CREATE TABLE ... LIKE”.

* `[AS] query_expression`

  Para criar uma tabela a partir de outra, adicione uma instrução `SELECT` no final da instrução `CREATE TABLE`:

  ```
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

  Para mais informações, consulte a Seção 15.1.24.4, “Instrução CREATE TABLE ... SELECT”.

* `IGNORE | REPLACE`

  As opções `IGNORE` e `REPLACE` indicam como lidar com linhas que duplicam valores de chave única ao copiar uma tabela usando uma instrução `SELECT`.

  Para mais informações, consulte a Seção 15.1.24.4, “Instrução CREATE TABLE ... SELECT”.

#### Tipos de Dados e Atributos de Colunas

Existe um limite máximo de 4096 colunas por tabela, mas o limite efetivo pode ser menor para uma tabela específica e depende dos fatores discutidos na Seção 10.4.7, “Limites de Contagem de Colunas e Tamanho de Linha da Tabela”.

* `data_type`

  * `data_type`* representa o tipo de dados em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de colunas, bem como informações sobre as propriedades de cada tipo, consulte o Capítulo 13, *Tipos de Dados*.

  + `AUTO_INCREMENT` aplica-se apenas a tipos inteiros.

  + Os tipos de dados de caracteres (`CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo de `CHARACTER SET`. Uma collation para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para detalhes, consulte o Capítulo 12, *Conjunto de Caracteres, Colagens, Unicode*. Exemplo:

    ```
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
    ```

    O MySQL 9.5 interpreta as especificações de comprimento em definições de colunas de caracteres em caracteres. Os comprimentos para `BINARY` e `VARBINARY` são em bytes.

+ Para as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`, podem ser criados índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice. As colunas `BLOB` e `TEXT` também podem ser indexadas, mas um comprimento de prefixo *deve* ser fornecido. Os comprimentos de prefixo são fornecidos em caracteres para tipos de strings não binários e em bytes para tipos de strings binárias. Ou seja, as entradas do índice consistem nos primeiros *`length`* caracteres de cada valor da coluna para as colunas `CHAR`, `VARCHAR` e `TEXT`, e nos primeiros *`length`* bytes de cada valor da coluna para as colunas `BINARY`, `VARBINARY` e `BLOB`. Indexar apenas um prefixo de valores de coluna dessa forma pode tornar o arquivo de índice muito menor. Para obter informações adicionais sobre prefixos de índice, consulte a Seção 15.1.18, “Instrução CREATE INDEX”.

    Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam a indexação em colunas `BLOB` e `TEXT`. Por exemplo:

    ```
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

    Se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, o `CREATE TABLE` lida com o índice da seguinte forma:

    - Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dados da coluna e uma mensagem de aviso é gerada (se o modo SQL rigoroso não estiver habilitado).

    - Para um índice único, ocorre um erro, independentemente do modo SQL, porque reduzir o comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

  + Colunas `JSON` não podem ser indexadas. Você pode contornar essa restrição criando um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Consulte Indexando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

* `NOT NULL | NULL`

Se não for especificado `NULL` ou `NOT NULL`, a coluna é tratada como se o valor `NULL` tivesse sido especificado.

No MySQL 9.5, apenas os motores de armazenamento `InnoDB`, `MyISAM` e `MEMORY` suportam índices em colunas que podem ter valores `NULL`. Em outros casos, você deve declarar colunas indexadas como `NOT NULL` ou ocorrerá um erro.

* `DEFAULT`

  Especifica um valor padrão para uma coluna. Para mais informações sobre o tratamento de valores padrão, incluindo o caso em que uma definição de coluna não inclui um valor `DEFAULT` explícito, consulte a Seção 13.6, “Valores padrão de tipo de dados”.

  Se o modo SQL `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE` estiver habilitado e um valor padrão com data não for correto de acordo com esse modo, o `CREATE TABLE` produz uma mensagem de aviso se o modo SQL rigoroso não estiver habilitado e um erro se o modo rigoroso estiver habilitado. Por exemplo, com `NO_ZERO_IN_DATE` habilitado, `c1 DATE DEFAULT '2010-00-00'` produz uma mensagem de aviso.

* `VISIBLE`, `INVISIBLE`

  Especifica a visibilidade da coluna. O padrão é `VISIBLE` se nenhuma das palavras-chave estiver presente. Uma tabela deve ter pelo menos uma coluna visível. Tentar tornar todas as colunas invisíveis produz um erro. Para mais informações, consulte a Seção 15.1.24.10, “Colunas invisíveis”.

* `AUTO_INCREMENT`

  Uma coluna inteira pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor de `NULL` (recomendado) ou `0` em uma coluna `AUTO_INCREMENT` indexada, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `valor+1`, onde *`valor`* é o maior valor para a coluna atualmente na tabela. As sequências `AUTO_INCREMENT` começam com `1`.

  Para recuperar um valor `AUTO_INCREMENT` após inserir uma linha, use a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Consulte a Seção 14.15, “Funções de informações”, e mysql\_insert\_id().

Se o modo SQL `NO_AUTO_VALUE_ON_ZERO` estiver habilitado, você pode armazenar `0` nas colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor da sequência. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

Só pode haver uma coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver valores positivos. Inserir um número negativo é considerado como inserir um número positivo muito grande. Isso é feito para evitar problemas de precisão quando os números "voltam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

Para tabelas `MyISAM`, você pode especificar uma coluna `AUTO_INCREMENT` secundária em uma chave de múltiplas colunas. Veja a Seção 5.6.9, “Usando AUTO\_INCREMENT”.

Para tornar o MySQL compatível com algumas aplicações ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última linha inserida com a seguinte consulta:

```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

Esse método exige que a variável `sql_auto_is_null` não esteja definida como 0. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para informações sobre `InnoDB` e `AUTO_INCREMENT`, veja a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB”. Para informações sobre `AUTO_INCREMENT` e a Replicação do MySQL, veja a Seção 19.5.1.1, “Replicação e AUTO\_INCREMENT”.

* `COMMENT`

Um comentário para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres. O comentário é exibido pelas instruções `SHOW CREATE TABLE` e `SHOW FULL COLUMNS`. Ele também é exibido na coluna `COLUMN_COMMENT` da tabela `COLUMNS` do Schema de Informações.

* `COLUMN_FORMAT`

No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais de tabelas `NDB` usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar armazenamento de largura fixa, `DYNAMIC` permite que a coluna tenha largura variável e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável, conforme determinado pelo tipo de dados da coluna (possivelmente sobrescrito por um especificador `ROW_FORMAT`).

Para tabelas `NDB`, o valor padrão para `COLUMN_FORMAT` é `FIXED`.

No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para mais informações e possíveis soluções, consulte a Seção 25.2.7.5, “Limites Associados a Objetos de Banco de Dados no NDB Cluster”.

`COLUMN_FORMAT` atualmente não tem efeito em colunas de tabelas que usam motores de armazenamento diferentes de `NDB`. O MySQL 9.5 ignora silenciosamente `COLUMN_FORMAT`.

* As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` são usadas para especificar atributos de coluna para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  O valor atribuído a esta opção é uma literal de string contendo um documento JSON válido ou uma string vazia (''). JSON inválido é rejeitado.

  ```
  CREATE TABLE t1 (c1 INT ENGINE_ATTRIBUTE='{"key":"value"}');
  ```

  Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é usado.

  Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o motor de armazenamento da tabela é alterado.

* `STORAGE`

Para tabelas `NDB`, é possível especificar se a coluna é armazenada no disco ou na memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada no disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. A instrução `CREATE TABLE` usada ainda deve incluir uma cláusula `TABLESPACE`:

```
  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) ENGINE NDB;
  ERROR 1005 (HY000): Can't create table 'c.t1' (errno: 140)

  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) TABLESPACE ts_1 ENGINE NDB;
  Query OK, 0 rows affected (1.06 sec)
  ```

Para tabelas `NDB`, `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

A cláusula `STORAGE` não tem efeito em tabelas que usam motores de armazenamento diferentes de `NDB`. A palavra-chave `STORAGE` é suportada apenas na versão do **mysqld** fornecida com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

* `GENERATED ALWAYS`

  Usado para especificar uma expressão de coluna gerada. Para informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

  Colunas geradas armazenadas podem ser indexadas. `InnoDB` suporta índices secundários em colunas geradas virtuais. Veja a Seção 15.1.24.9, “Indizes Secundários e Colunas Geradas”.

#### Índices, Chaves Estrangeiras e Restrições CHECK

Várias palavras-chave se aplicam à criação de índices, chaves estrangeiras e restrições `CHECK`. Para informações gerais além das descrições a seguir, consulte a Seção 15.1.18, “Instrução CREATE INDEX”, a Seção 15.1.24.5, “Restrições FOREIGN KEY” e a Seção 15.1.24.6, “Restrições CHECK”.

* `CONSTRAINT símbolo`

A cláusula do símbolo `CONSTRAINT` pode ser usada para nomear uma restrição. Se a cláusula não for fornecida ou se um *símbolo* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição, com a exceção mencionada abaixo. O valor do *símbolo*, se usado, deve ser único por esquema (banco de dados), por tipo de restrição. Um *símbolo* duplicado resulta em um erro. Veja também a discussão sobre os limites de comprimento dos identificadores de restrições na Seção 11.2.1, “Limites de comprimento de identificadores”.

Nota

Se a cláusula `CONSTRAINT símbolo` não for fornecida em uma definição de chave estrangeira ou se um *símbolo* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas as restrições de diferentes tipos podem ter o mesmo nome.

* `PRIMARY KEY`

Um índice único onde todas as colunas da chave devem ser definidas como `NOT NULL`. Se elas não forem declaradas explicitamente como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas um `PRIMARY KEY`. O nome de um `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como o nome para qualquer outro tipo de índice.

Se você não tiver um `PRIMARY KEY` e uma aplicação solicitar o `PRIMARY KEY` em suas tabelas, o MySQL retorna o primeiro `UNIQUE` índice que não tem colunas `NULL` como `PRIMARY KEY`.

Nas tabelas `InnoDB`, mantenha o `PRIMARY KEY` curto para minimizar o overhead de armazenamento para índices secundários. Cada entrada de índice secundário contém uma cópia das colunas da chave primária da linha correspondente. (Veja a Seção 17.6.2.1, “Índices Agrupados e Secundários”.)

Na tabela criada, um `PRIMARY KEY` é colocado primeiro, seguido de todos os índices `UNIQUE` e, em seguida, os índices não únicos. Isso ajuda o otimizador do MySQL a priorizar qual índice usar e também a detectar mais rapidamente chaves `UNIQUE` duplicadas.

Um `PRIMARY KEY` pode ser um índice de múltiplas colunas. No entanto, você não pode criar um índice de múltiplas colunas usando o atributo `KEY` `PRIMARY` em uma especificação de coluna. Isso apenas marca a única coluna como primária. Você deve usar uma cláusula `PRIMARY KEY(chave_parte, ...)` separada.

Se uma tabela tiver um `PRIMARY KEY` ou um índice `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

No MySQL, o nome de um `PRIMARY KEY` é `PRIMARY`. Para outros índices, se você não atribuir um nome, o índice recebe o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo único. Você pode ver os nomes dos índices de uma tabela usando `SHOW INDEX FROM tbl_name`. Veja a Seção 15.7.7.24, “Instrução SHOW INDEX”.

* `KEY | INDEX`

`KEY` normalmente é sinônimo de `INDEX`. O atributo `KEY` `PRIMARY KEY` também pode ser especificado como apenas `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros sistemas de banco de dados.

* `UNIQUE`

Um índice `UNIQUE` cria uma restrição de forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Para todos os motores, um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor de prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

* `FULLTEXT`

  Um índice `FULLTEXT` é um tipo especial de índice usado para buscas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT`. Eles podem ser criados apenas a partir de colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna; a indexação de prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Veja a Seção 14.9, “Funções de Busca de Texto Completo”, para detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um valor de *`index_option`* para associar um plugin de analisador ao índice se as operações de indexação e busca de texto completo precisarem de tratamento especial. Esta cláusula é válida apenas para índices `FULLTEXT`. `InnoDB` e `MyISAM` suportam plugins de analisadores de texto completo. Veja Plugins de Analisadores de Texto Completo e Escrevendo Plugins de Analisadores de Texto Completo para mais informações.

* `SPATIAL`

  Você pode criar índices `SPATIAL` em tipos de dados espaciais. Os tipos espaciais são suportados apenas para tabelas `InnoDB` e `MyISAM`, e as colunas indexadas devem ser declaradas como `NOT NULL`. Veja a Seção 13.4, “Tipos de Dados Espaciais”.

* `FOREIGN KEY`

MySQL suporta chaves estrangeiras, que permitem cruzar dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter esses dados dispersos consistentes. Para informações sobre definição e opções, consulte *`reference_definition`* e *`reference_option`*.

Tabelas particionadas que utilizam o motor de armazenamento `InnoDB` não suportam chaves estrangeiras. Consulte a Seção 26.6, “Restrições e Limitações na Partição”, para obter mais informações.

* `CHECK`

  A cláusula `CHECK` permite a criação de restrições que devem ser verificadas para os valores de dados nas linhas da tabela. Consulte a Seção 15.1.24.6, “Restrições `CHECK`”.

* `key_part`

  + Uma especificação de *`key_part`* pode terminar com `ASC` ou `DESC` para especificar se os valores do índice são armazenados em ordem ascendente ou descendente. O padrão é ascendente se nenhum especificador de ordem for fornecido.

  + Prefixos, definidos pelo atributo *`length`*, podem ter até 767 bytes de comprimento para tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para tabelas `InnoDB` que utilizam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes.

    Os *limits* de prefixo são medidos em bytes. No entanto, os *lengths* de prefixo para especificações de índice nas declarações `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

* `expr` para uma especificação de `key_part` pode ter a forma `(CAST json_path AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Índices de Múltiplos Valores fornecem informações detalhadas sobre a criação, uso e restrições e limitações de índices de múltiplos valores.

* `index_type`

  Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador `index_type` é `USING nome_do_tipo`.

  Exemplo:

  ```
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id)
  ) ENGINE = MEMORY;
  ```

  A posição preferida para `USING` é após a lista de colunas do índice. Pode ser dada antes da lista de colunas, mas o suporte para o uso da opção nessa posição é desatualizado e você deve esperar que ela seja removida em uma futura versão do MySQL.

* `index_option`

  Os valores de `index_option` especificam opções adicionais para um índice.

  + `KEY_BLOCK_SIZE`

    Para tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para blocos de chaves de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor de `KEY_BLOCK_SIZE` no nível da tabela.

    Para informações sobre o atributo `KEY_BLOCK_SIZE` no nível da tabela, consulte Opções da Tabela.

  + `WITH PARSER`

    A opção `WITH PARSER` só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de parser ao índice se as operações de indexação e busca de texto completo precisarem de tratamento especial. `InnoDB` e `MyISAM` suportam plugins de parser de texto completo. Se você tiver uma tabela `MyISAM` com um plugin de parser de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

  + `COMMENT`

    As definições de índice podem incluir um comentário opcional de até 1024 caracteres.

Você pode definir o valor `MERGE_THRESHOLD` do `InnoDB` para um índice individual usando a cláusula `COMMENT` da opção `index_option`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índices”.

  + `VISIBLE`, `INVISIBLE`

    Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é usado pelo otimizador. A especificação da visibilidade do índice aplica-se a índices que não são chaves primárias (explícitos ou implícitos). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

  + As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` são usadas para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  Para mais informações sobre os valores permitidos de *`index_option`*, consulte a Seção 15.1.18, “Instrução CREATE INDEX”. Para mais informações sobre índices, consulte a Seção 10.3.1, “Como o MySQL Usa Índices”.

* `reference_definition`

  Para detalhes e exemplos da sintaxe de *`reference_definition`*, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

  As tabelas `InnoDB` e `NDB` suportam a verificação de restrições de chave estrangeira. As colunas da tabela referenciada devem sempre ser nomeadas explicitamente. As ações `ON DELETE` e `ON UPDATE` em chaves estrangeiras são suportadas. Para informações mais detalhadas e exemplos, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

  Para outros motores de armazenamento, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas instruções `CREATE TABLE`.

  Importante

Para usuários familiarizados com o padrão ANSI/ISO SQL, observe que nenhum mecanismo de armazenamento, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, o uso de `MATCH` deve ser evitado.

A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplas colunas) são tratados ao serem comparados a uma chave primária. O `InnoDB` implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permitem que uma chave estrangeira seja `NULL` total ou parcialmente. Nesse caso, a linha da tabela (filha) que contém essa chave estrangeira é permitida para ser inserida e não corresponde a nenhuma linha na tabela referenciada (pai). É possível implementar outras semânticas usando gatilhos.

Além disso, o MySQL exige que as colunas referenciadas sejam indexadas para desempenho. No entanto, o `InnoDB` não impõe qualquer requisito de que as colunas referenciadas sejam declaradas `UNIQUE` ou `NOT NULL`. O tratamento de referências de chaves estrangeiras a chaves não únicas ou chaves que contêm valores `NULL` não é bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você é aconselhado a usar chaves estrangeiras que refiram apenas chaves que sejam `UNIQUE` (ou `PRIMARY`) e `NOT NULL`.

O MySQL aceita especificações de `inline `REFERENCES` (como definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL também aceita referências implícitas à chave primária da tabela pai. Para mais informações, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”, bem como a Seção 1.7.2.3, “Diferenças na Restrição de Chave Estrangeira”.

* `reference_option`

Para obter informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

#### Opções de Tabela

As opções de tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os motores de armazenamento, a menos que indicado de outra forma. Opções que não se aplicam a um determinado motor de armazenamento podem ser aceitas e lembradas como parte da definição da tabela. Essas opções então se aplicam se você usar `ALTER TABLE` posteriormente para converter a tabela para usar um motor de armazenamento diferente.

* `ENGINE`

  Especifica o motor de armazenamento para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do motor pode ser não citado ou citado. O nome citado `'DEFAULT'` é reconhecido, mas ignorado.

<table summary="Nomes de motores de armazenamento permitidos para a opção ENGINE da tabela e uma descrição de cada motor."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Motor de Armazenamento</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code class="literal">InnoDB</code></td> <td>Tabelas seguras para transações com bloqueio de linhas e chaves estrangeiras. O motor de armazenamento padrão para novas tabelas. Consulte <a class="xref" href="innodb-storage-engine.html" title="Capítulo 17 O Motor de Armazenamento InnoDB" target="_blank">Capítulo 17, <i>O Motor de Armazenamento InnoDB</i></a>, e, em particular, <a class="xref" href="innodb-introduction.html" title="17.1 Introdução ao InnoDB" target="_blank">Seção 17.1, “Introdução ao InnoDB”</a> se você tem experiência com MySQL, mas é novo no <code class="literal">InnoDB</code>.</td> </tr><tr> <td><code class="literal">MyISAM</code></td> <td>O motor de armazenamento portátil binário que é usado principalmente para cargas de trabalho de leitura apenas ou predominantemente de leitura. Consulte <a class="xref" href="myisam-storage-engine.html" title="Capítulo 18.2 O Motor de Armazenamento MyISAM" target="_blank">Seção 18.2, “O Motor de Armazenamento MyISAM”</a>.</td> </tr><tr> <td><code class="literal">MEMORY</code></td> <td>Os dados deste motor de armazenamento são armazenados apenas na memória. Consulte <a class="xref" href="memory-storage-engine.html" title="Capítulo 18.3 O Motor de Armazenamento MEMORY" target="_blank">Seção 18.3, “O Motor de Armazenamento MEMORY”</a>.</td> </tr><tr> <td><code class="literal">CSV</code></td> <td>Tabelas que armazenam linhas no formato de valores separados por vírgula. Consulte <a class="xref" href="csv-storage-engine.html" title="Capítulo 18.4 O Motor de Armazenamento CSV" target="_blank">Seção 18.4, “O Motor de Armazenamento CSV”</a>.</td> </tr><tr> <td><code class="literal">ARCHIVE</code></td> <td>O motor de armazenamento de arquivamento. Consulte <a class="xref" href="archive-storage-engine.html" title="Capítulo 18.5 O Motor de Armazenamento ARCHIVE" target="_blank">Seção 18.5, “O Motor de Armazenamento ARCHIVE”</a>.</td> </tr><tr> <td><code class="literal">EXAMPLE</code></td> <td>Um motor de exemplo. Consulte <a class="xref" href="example-storage-engine.html" title="Capítulo 18.9 O Motor de Armazenamento EXAMPLE" target="_blank">Seção 18.9, “O Motor de Armazenamento EXAMPLE”</a>.</td> </tr><tr> <td><code class="literal">FEDERATED</code></td> <td>Motor de armazenamento que acessa tabelas remotas. Consulte <a class="xref" href="federated-storage-engine.html" title="Capítulo 18.8 O Motor de Armazenamento FEDERATED" target="_blank">Seção 18.8, “O Motor de Armazenamento FEDERATED”</a>.</td> </tr><tr> <td><code class="literal">HEAP</code></td> <td>Este é um sinônimo de <code class="literal">MEMORY</code>.</td> </tr><tr> <td><code class="literal">MERGE</code></td> <td>Uma coleção de tabelas <code class="literal">MyISAM</code> usadas como uma única tabela. Também conhecido como <code class="literal">MRG_MyISAM</code>. Consulte <a class="xref" href="merge-storage-engine.html" title="Capítulo 18.7 O Motor de Armazenamento MERGE" target="_blank">Seção 18.7, “O Motor de Armazenamento MERGE”</a>.</td> </tr><tr> <td><a class="link" href="mysql-cluster.html" title="Capítulo 25 MySQL NDB Cluster 9.5"><code class="literal">NDB</code></a></td> <td>Tabelas agrupadas, tolerantes a falhas e baseadas em memória, suportando transações e chaves estrangeiras. Também conhecido como <a class="link" href="mysql-cluster.html" title="Capítulo

Por padrão, se um mecanismo de armazenamento for especificado que não está disponível, a instrução falha com um erro. Você pode sobrepor esse comportamento removendo `NO_ENGINE_SUBSTITUTION` do modo SQL do servidor (consulte a Seção 7.1.11, “Modos SQL do Servidor”) para que o MySQL permita a substituição do mecanismo especificado pelo mecanismo de armazenamento padrão. Normalmente, nesse caso, é `InnoDB`, que é o valor padrão para a variável de sistema `default_storage_engine`. Quando `NO_ENGINE_SUBSTITUTION` é desativado, um aviso ocorre se a especificação do mecanismo de armazenamento não for atendida.

* `AUTOEXTEND_SIZE`

  Define a quantidade pela qual o `InnoDB` estende o tamanho do espaço de tabelas quando ele se torna cheio. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabelas seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND\_SIZE do Espaço de Tabelas”.

* `AUTO_INCREMENT`

  O valor inicial de `AUTO_INCREMENT` para a tabela. No MySQL 9.5, isso funciona para tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor de autoincremento para motores que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma linha “falsa” com um valor menor que o valor desejado após criar a tabela e, em seguida, exclua a linha falsa.

  Para motores que suportam a opção `AUTO_INCREMENT` da tabela em declarações `CREATE TABLE`, você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor de `AUTO_INCREMENT`. O valor não pode ser definido menor que o valor máximo atualmente na coluna.

* `AVG_ROW_LENGTH`

  Uma aproximação da largura média da linha para sua tabela. Você precisa definir isso apenas para tabelas grandes com linhas de tamanho variável.

Quando você cria uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir o tamanho da tabela resultante. Se você não especificar nenhuma dessas opções, o tamanho máximo para os arquivos de dados e índices `MyISAM` é de 256TB por padrão. (Se o seu sistema operacional não suportar arquivos tão grandes, os tamanhos das tabelas são limitados pelo limite de tamanho do arquivo.) Se você quiser manter os tamanhos dos ponteiros pequenos para tornar o índice menor e mais rápido e não precisar realmente de grandes arquivos, você pode diminuir o tamanho padrão do ponteiro configurando a variável de sistema `myisam_data_pointer_size`. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.) Se você quiser que todas as suas tabelas possam crescer acima do limite padrão e estiver disposto a ter suas tabelas um pouco mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro configurando essa variável. Definir o valor para 7 permite tamanhos de tabela de até 65.536TB.

* `[DEFAULT] CHARACTER SET`

  Especifica um conjunto de caracteres padrão para a tabela. `CHARSET` é um sinônimo de `CHARACTER SET`. Se o nome do conjunto de caracteres for `DEFAULT`, o conjunto de caracteres do banco de dados é usado.

* `CHECKSUM`

  Defina para 1 se você quiser que o MySQL mantenha um checksum em tempo real para todas as linhas (ou seja, um checksum que o MySQL atualiza automaticamente à medida que a tabela muda). Isso torna a tabela um pouco mais lenta para atualizar, mas também facilita a localização de tabelas corrompidas. A instrução `CHECKSUM TABLE` relata o checksum. (`MyISAM` apenas.)

* `[DEFAULT] COLLATE`

  Especifica um conjunto de collation padrão para a tabela.

* `COMMENT`

  Um comentário para a tabela, com até 2048 caracteres.

  Você pode definir o valor de `MERGE_THRESHOLD` para uma tabela usando a cláusula `COMMENT` do `table_option`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índices”.

**Definindo opções de NDB_TABLE.**

O comentário da tabela em uma instrução `CREATE TABLE` que cria uma tabela `NDB` ou uma instrução `ALTER TABLE` que altera uma pode também ser usado para especificar um a quatro das opções `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED` do `NDB_TABLE` como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a string `NDB_TABLE=` que inicia o texto do comentário entre aspas. Um exemplo de instrução usando essa sintaxe é mostrado aqui (texto destacado):

```
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

Espaços não são permitidos dentro da string entre aspas. A string é case-insensitive.

O comentário é exibido como parte da saída de `SHOW CREATE TABLE`. O texto do comentário também está disponível como a coluna TABLE_COMMENT da tabela `TABLES` do Schema de Informações MySQL.

Essa sintaxe de comentário também é suportada com instruções `ALTER TABLE` para tabelas `NDB`. Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter tido anteriormente.

Definir a opção `MERGE_THRESHOLD` em comentários de tabela não é suportado para tabelas `NDB` (é ignorado).

Para informações completas sobre sintaxe e exemplos, consulte a Seção 15.1.24.12, “Definindo Opções de Comentário NDB”.

* `COMPRESSION`

  O algoritmo de compressão usado para compressão de nível de página para tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com o recurso de compressão de página transparente. A compressão de página só é suportada com tabelas `InnoDB` que residem em espaços de tabelas por arquivo, e está disponível apenas em plataformas Linux e Windows que suportam arquivos esparsos e perfuração de buracos. Para mais informações, consulte a Seção 17.9.2, “Compressão de Página InnoDB”.

A cadeia de conexão para uma tabela `FEDERATED`.

Nota

Versões mais antigas do MySQL usavam uma opção `COMMENT` para a cadeia de conexão.

* `DATA DIRECTORY`, `INDEX DIRECTORY`

  Para `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite criar tabelas fora do diretório de dados. A variável `innodb_file_per_table` deve estar habilitada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado e conhecido pelo `InnoDB`. Para mais informações, consulte a Seção 17.6.1.2, “Criando Tabelas Externamente”.

  Ao criar tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de índice de uma tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondem ao nome do banco de dados ao criar uma tabela `MyISAM` com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

  Você deve ter o privilégio `FILE` para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

Importante

As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas para tabelas particionadas. (Bug #32091)

Essas opções funcionam apenas quando você não está usando a opção `--skip-symbolic-links`. Seu sistema operacional também deve ter uma chamada `realpath()` segura e confiável. Consulte a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas `MyISAM` no Unix”, para obter informações mais completas.

Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo `.MYD` existente nesse caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção `--keep_files_on_create`, caso contrário, `MyISAM` não sobrescreverá arquivos existentes e retornará um erro.

Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, `MyISAM` sempre retornará um erro e não sobrescreverá um arquivo no diretório especificado.

Importante

Você não pode usar nomes de caminho que contenham o diretório de dados do MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e particionamentos individuais de tabelas. (Veja o bug
#32167.)

* `DELAY_KEY_WRITE`

Defina para 1 se quiser adiar as atualizações de chave da tabela até que a tabela seja fechada. Veja a descrição da variável de sistema `delay_key_write` na Seção 7.1.8, “Variáveis de sistema do servidor”. (`MyISAM` apenas.)

* `ENCRYPTION`

A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave deve ser instalado e configurado antes que a criptografia possa ser habilitada. A cláusula `ENCRYPTION` pode ser especificada ao criar uma tabela em um espaço de tabelas por arquivo ou ao criar uma tabela em um espaço de tabelas geral.

A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, funciona apenas se o motor de armazenamento padrão for `InnoDB`, ou se a instrução `CREATE TABLE` especificar também `ENGINE=InnoDB`. Caso contrário, a instrução será rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

Uma tabela herda a criptografia de esquema padrão se uma cláusula `ENCRYPTION` não for especificada. Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para criar uma tabela com uma configuração de cláusula `ENCRYPTION` que difere da criptografia de esquema padrão. Ao criar uma tabela em um espaço de tabelas geral, a criptografia da tabela e do espaço de tabelas deve corresponder.

Especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` não é permitido ao usar um mecanismo de armazenamento que não suporte criptografia.

Para mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` são usadas para especificar atributos de tabela para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

O valor atribuído a qualquer uma dessas opções deve ser uma literal de string contendo um documento JSON válido ou uma string vazia (''). O JSON inválido é rejeitado.

```
  CREATE TABLE t1 (c1 INT) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é usado.

Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o motor de armazenamento da tabela é alterado.

* `INSERT_METHOD`

Se você deseja inserir dados em uma tabela `MERGE`, você deve especificar com `INSERT_METHOD` a tabela na qual a linha deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use um valor de `FIRST` ou `LAST` para que as inserções sejam feitas na primeira ou última tabela, ou um valor de `NO` para impedir inserções. Consulte a Seção 18.7, “O Motor de Armazenamento MERGE”.

* `KEY_BLOCK_SIZE`

Para tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para blocos de chaves de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor de `KEY_BLOCK_SIZE` do nível da tabela.

Para tabelas `InnoDB`, `KEY_BLOCK_SIZE` especifica o tamanho da página em kilobytes a ser usado para tabelas `InnoDB` compactadas. O valor de `KEY_BLOCK_SIZE` é tratado como um indicativo; o `InnoDB` pode usar um tamanho diferente se necessário. `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor de `innodb_page_size`. Um valor de 0 representa o tamanho padrão da página compactada, que é metade do valor de `innodb_page_size`. Dependendo de `innodb_page_size`, os possíveis valores de `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Veja a Seção 17.9.1, “Compressão de Tabelas InnoDB” para mais informações.

A Oracle recomenda a ativação de `innodb_strict_mode` ao especificar `KEY_BLOCK_SIZE` para tabelas `InnoDB`. Quando `innodb_strict_mode` está habilitado, especificar um valor de `KEY_BLOCK_SIZE` inválido retorna um erro. Se `innodb_strict_mode` estiver desabilitado, um valor de `KEY_BLOCK_SIZE` inválido resulta em um aviso e a opção `KEY_BLOCK_SIZE` é ignorada.

A coluna `Create_options` na resposta a `SHOW TABLE STATUS` relata o `KEY_BLOCK_SIZE` real usado pela tabela, assim como `SHOW CREATE TABLE`.

`InnoDB` só suporta `KEY_BLOCK_SIZE` no nível da tabela.

`KEY_BLOCK_SIZE` não é suportado com valores de `innodb_page_size` de 32 KB e 64 KB. A compressão de tabelas `InnoDB` não suporta esses tamanhos de páginas.

`InnoDB` não suporta a opção `KEY_BLOCK_SIZE` ao criar tabelas temporárias.

O número máximo de linhas que você planeja armazenar na tabela. Esse não é um limite rígido, mas sim um indicativo para o mecanismo de armazenamento de que a tabela deve ser capaz de armazenar pelo menos esse número de linhas.

Importante

O uso de `MAX_ROWS` com tabelas `NDB` para controlar o número de partições da tabela é desaconselhado. Ele ainda é suportado em versões posteriores para compatibilidade com versões anteriores, mas está sujeito à remoção em uma futura versão. Use `PARTITION_BALANCE` em vez disso; veja Configurando opções de NDB_TABLE.

O mecanismo de armazenamento `NDB` trata esse valor como um máximo. Se você planeja criar tabelas de NDB Cluster muito grandes (contendo milhões de linhas), você deve usar essa opção para garantir que o `NDB` aloque um número suficiente de slots de índice na tabela hash usada para armazenar hashes das chaves primárias da tabela, definindo `MAX_ROWS = 2 * rows`, onde *`rows`* é o número de linhas que você espera inserir na tabela.

O valor máximo de `MAX_ROWS` é 4294967295; valores maiores são truncados para esse limite.

* `MIN_ROWS`

  O número mínimo de linhas que você planeja armazenar na tabela. O mecanismo de armazenamento `MEMORY` usa essa opção como um indicativo sobre o uso de memória.

* `PACK_KEYS`

  É eficaz apenas com tabelas `MyISAM`. Defina essa opção para 1 se você quiser ter índices menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção para 0 desabilita todo o empilhamento de chaves. Definir para `DEFAULT` indica ao mecanismo de armazenamento que ele deve empilhar apenas colunas `CHAR`, `VARCHAR`, `BINARY` ou `VARBINARY` longas.

  Se você não usar `PACK_KEYS`, o padrão é empilhar strings, mas não números. Se você usar `PACK_KEYS=1`, os números também são empilhados.

  Ao empilhar chaves de números binários, o MySQL usa compressão prefixal:

  + Cada chave precisa de um byte extra para indicar quantos bytes da chave anterior são os mesmos para a próxima chave.

+ O ponteiro para a linha é armazenado na ordem de alto byte diretamente após a chave, para melhorar a compressão.

Isso significa que, se você tiver muitas chaves iguais em duas linhas consecutivas, todas as chaves seguintes geralmente ocupam apenas dois bytes (incluindo o ponteiro para a linha). Compare isso com o caso comum em que as chaves seguintes ocupam `tamanho_de_armazenamento_para_chave + tamanho_do_ponteiro` (onde o tamanho do ponteiro geralmente é 4). Por outro lado, você obtém um benefício significativo da compressão prefixada apenas se tiver muitos números iguais. Se todas as chaves forem totalmente diferentes, você usa um byte a mais por chave, se a chave não for uma chave que pode ter valores `NULL`. (Neste caso, o comprimento da chave compactada é armazenado no mesmo byte que é usado para marcar se uma chave é `NULL`.)

* `PASSWORD`

  Esta opção não é usada.

* `ROW_FORMAT`

  Define o formato físico em que as linhas são armazenadas.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do motor de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` na resposta a `SHOW TABLE STATUS`. A coluna `Create_options` mostra o formato de linha que foi especificado na instrução `CREATE TABLE`, assim como `SHOW CREATE TABLE`.

  As opções de formato de linha diferem dependendo do motor de armazenamento usado para a tabela.

  Para tabelas `InnoDB`:

  + O formato de linha padrão é definido por `innodb_default_row_format`, que tem um ajuste padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` não é definida ou quando `ROW_FORMAT=DEFAULT` é usada.

Se a opção `ROW_FORMAT` não for definida ou se `ROW_FORMAT=DEFAULT` for usada, as operações que reconstruem uma tabela também alteram silenciosamente o formato da linha da tabela para o padrão definido por `innodb_default_row_format`. Para obter mais informações, consulte Definindo o Formato da Linha de uma Tabela.

+ Para um armazenamento mais eficiente dos tipos de dados `InnoDB`, especialmente os tipos `BLOB`, use o `DYNAMIC`. Consulte o Formato de Linha `DYNAMIC` para requisitos associados ao formato de linha `DYNAMIC`.

+ Para habilitar a compressão para tabelas `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. A opção `ROW_FORMAT=COMPRESSED` não é suportada ao criar tabelas temporárias. Consulte a Seção 17.9, “Compressão de Tabelas e Páginas do InnoDB” para requisitos associados ao formato de linha `COMPRESSED`.

+ O formato de linha usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o formato de linha `REDUNDANT`.

+ Ao especificar uma cláusula `ROW_FORMAT` não padrão, considere também habilitar a opção de configuração `innodb_strict_mode`.

+ `ROW_FORMAT=FIXED` não é suportada. Se `ROW_FORMAT=FIXED` for especificado enquanto `innodb_strict_mode` está desativado, o `InnoDB` emite um aviso e assume `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` for especificado enquanto `innodb_strict_mode` está habilitado, o que é o padrão, o `InnoDB` retorna um erro.

+ Para obter informações adicionais sobre os formatos de linha do `InnoDB`, consulte a Seção 17.10, “Formatos de Linha do InnoDB”.

Para tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para formatos de linha estáticos ou de comprimento variável. **myisampack** define o tipo para `COMPRESSED`. Consulte a Seção 18.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

Para tabelas `NDB`, o `ROW_FORMAT` padrão é `DYNAMIC`.

Esta é uma opção de tabela para uso interno, usada para permitir que a instrução `CREATE TABLE ... SELECT` seja registrada como uma única transação atômica no log binário ao usar a replicação baseada em linhas com um mecanismo de armazenamento que suporte a DDL atômica. Somente as instruções `BINLOG`, `COMMIT` e `ROLLBACK` são permitidas após `CREATE TABLE ... START TRANSACTION`. Para informações relacionadas, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

* `STATS_AUTO_RECALC`

  Especifica se os dados persistentes das estatísticas de uma tabela `InnoDB` devem ser recalculados automaticamente. O valor `DEFAULT` faz com que o ajuste de estatísticas persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_auto_recalc`. O valor `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados na tabela forem alterados. O valor `0` impede a recalculação automática para esta tabela; com este ajuste, execute uma instrução `ANALYZE TABLE` para recalcular as estatísticas após fazer alterações substanciais na tabela. Para mais informações sobre o recurso de estatísticas persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

* `STATS_PERSISTENT`

Especifica se habilitar estatísticas persistentes para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste de estatísticas persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_persistent`. O valor `1` habilita estatísticas persistentes para a tabela, enquanto o valor `0` desativa esse recurso. Após habilitar estatísticas persistentes por meio de uma instrução `CREATE TABLE` ou `ALTER TABLE`, execute uma instrução `ANALYZE TABLE` para calcular as estatísticas, após carregar dados representativos na tabela. Para obter mais informações sobre o recurso de estatísticas persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

* `STATS_SAMPLE_PAGES`

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

* `TABLESPACE`

  A cláusula `TABLESPACE` pode ser usada para criar uma tabela `InnoDB` em um espaço de tabelas geral existente, um espaço de tabelas por arquivo ou o espaço de tabelas do sistema.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

  O espaço de tabelas que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para obter informações sobre espaços de tabelas gerais, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

  O `tablespace_name` é um identificador sensível a maiúsculas e minúsculas. Ele pode ser citado ou não. O caractere barra invertida (“/”) não é permitido. Os nomes que começam com “innodb\_” são reservados para uso especial.

  Para criar uma tabela no espaço de tabelas do sistema, especifique `innodb_system` como o nome do espaço de tabelas.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

Usando `TABLESPACE [=] innodb_system`, você pode colocar uma tabela de qualquer formato de linha não compactada no espaço de tabelas do sistema, independentemente da configuração `innodb_file_per_table`. Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao espaço de tabelas do sistema usando `TABLESPACE [=] innodb_system`.

Para criar uma tabela em um espaço de tabelas por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabelas.

```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

Nota

Se `innodb_file_per_table` estiver habilitado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um espaço de tabelas por arquivo `InnoDB`. As tabelas `InnoDB` são criadas em espaços de tabelas por arquivo por padrão quando `innodb_file_per_table` está habilitado.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas de outra forma não é suportada para uso em combinação com a cláusula `TABLESPACE`. O diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido pelo `InnoDB`. Para mais informações, consulte Usando a cláusula DATA DIRECTORY.

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` está desatualizado; espere-o ser removido em uma versão futura do MySQL.

A opção de tabela `STORAGE` é empregada apenas com tabelas `NDB`. `STORAGE` determina o tipo de armazenamento usado e pode ser `DISK` ou `MEMORY`.

`TABLESPACE ... STORAGE DISK` atribui uma tabela a um espaço de dados de NDB Cluster Disk. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por `TABLESPACE` *`tablespace_name`*.

Para `STORAGE MEMORY`, o nome do espaço de tabelas é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está na memória.

Consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”, para obter mais informações.

* `UNION`

  Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma única. Isso funciona apenas com tabelas `MERGE`. Consulte a Seção 18.7, “O Motor de Armazenamento MERGE”.

  Você deve ter privilégios de `SELECT`, `UPDATE` e `DELETE` para as tabelas que você mapeia para uma tabela `MERGE`.

  Nota

  Anteriormente, todas as tabelas usadas tinham que estar no mesmo banco de dados que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Partição de Tabelas

* `partition_options`* pode ser usado para controlar a partição da tabela criada com `CREATE TABLE`.

Nem todas as opções mostradas na sintaxe para *`partition_options`* no início desta seção estão disponíveis para todos os tipos de partição. Consulte as listagens para os seguintes tipos individuais para informações específicas de cada tipo, e consulte o Capítulo 26, *Partição*, para obter informações mais completas sobre o funcionamento e os usos da partição no MySQL, além de exemplos adicionais de criação de tabelas e outras declarações relacionadas à partição no MySQL.

As partições podem ser modificadas, unidas, adicionadas a tabelas e removidas de tabelas. Para informações básicas sobre as declarações MySQL para realizar essas tarefas, consulte a Seção 15.1.11, “Declaração ALTER TABLE”. Para descrições e exemplos mais detalhados, consulte a Seção 26.3, “Gestão de Partição”.

* `PARTITION BY`

  Se usado, uma cláusula de *`partition_options`* começa com `PARTITION BY`. Esta cláusula contém a função usada para determinar a partição; a função retorna um valor inteiro variando de 1 a *`num`*, onde *`num`* é o número de partições. (O número máximo de partições definidas pelo usuário que uma tabela pode conter é 1024; o número de subpartições—discutido mais adiante nesta seção—está incluído nesse máximo.)

Nota

A expressão (*`expr`*) usada em uma cláusula `PARTITION BY` não pode se referir a nenhuma coluna que não esteja na tabela sendo criada; tais referências não são especificamente permitidas e causam o falhar da declaração com um erro. (Bug #29444)

* `HASH(expr)`

  Hashas uma ou mais colunas para criar uma chave para a colocação e localização de linhas. *`expr`* é uma expressão que usa uma ou mais colunas da tabela. Isso pode ser qualquer expressão MySQL válida (incluindo funções MySQL) que produza um único valor inteiro. Por exemplo, estes são ambos declarações `CREATE TABLE` válidas usando `PARTITION BY HASH`:

  ```
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

  Você não pode usar cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

  `PARTITION BY HASH` usa o resto de *`expr`* dividido pelo número de partições (ou seja, o módulo). Para exemplos e informações adicionais, consulte a Seção 26.2.4, “Partitionamento HASH”.

  A palavra-chave `LINEAR` implica em um algoritmo um pouco diferente. Neste caso, o número da partição na qual uma linha é armazenada é calculado como o resultado de uma ou mais operações lógicas `AND`. Para discussão e exemplos de hashing linear, consulte a Seção 26.2.4.1, “Partitionamento HASH LINEAR”.

* `KEY(column_list)`

  Isso é semelhante a `HASH`, exceto que o MySQL fornece a função de hashing para garantir uma distribuição de dados uniforme. O argumento *`column_list`* é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples particionada por chave, com 4 partições:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```ppRB6z7BsO```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```kioc4LNaH1```
  CREATE TABLE t1 (
      year_col  INT,
      some_data INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2002),
      PARTITION p4 VALUES LESS THAN (2006),
      PARTITION p5 VALUES LESS THAN MAXVALUE
  );
  ```yJX36SBjiJ```
  CREATE TABLE rc (
      a INT NOT NULL,
      b INT NOT NULL
  )
  PARTITION BY RANGE COLUMNS(a,b) (
      PARTITION p0 VALUES LESS THAN (10,5),
      PARTITION p1 VALUES LESS THAN (20,10),
      PARTITION p2 VALUES LESS THAN (50,MAXVALUE),
      PARTITION p3 VALUES LESS THAN (65,MAXVALUE),
      PARTITION p4 VALUES LESS THAN (MAXVALUE,MAXVALUE)
  );
  ```nugajzNXf0```
  CREATE TABLE client_firms (
      id   INT,
      name VARCHAR(35)
  )
  PARTITION BY LIST (id) (
      PARTITION r0 VALUES IN (1, 5, 9, 13, 17, 21),
      PARTITION r1 VALUES IN (2, 6, 10, 14, 18, 22),
      PARTITION r2 VALUES IN (3, 7, 11, 15, 19, 23),
      PARTITION r3 VALUES IN (4, 8, 12, 16, 20, 24)
  );
  ```JXll0Wn10W```
  CREATE TABLE lc (
      a INT NULL,
      b INT NULL
  )
  PARTITION BY LIST COLUMNS(a,b) (
      PARTITION p0 VALUES IN( (0,0), (NULL,NULL) ),
      PARTITION p1 VALUES IN( (0,1), (0,2), (0,3), (1,1), (1,2) ),
      PARTITION p2 VALUES IN( (1,0), (2,0), (2,1), (3,0), (3,1) ),
      PARTITION p3 VALUES IN( (1,3), (2,2), (2,3), (3,2), (3,3) )
  );
  ```qVV5fDPmlm```
    COMMENT = 'Data for the years previous to 1999'
    ```VA5H5C2Z5d```
    CREATE TABLE th (id INT, name VARCHAR(30), adate DATE)
    PARTITION BY LIST(YEAR(adate))
    (
      PARTITION p1999 VALUES IN (1995, 1999, 2003)
        DATA DIRECTORY = '/var/appdata/95/data'
        INDEX DIRECTORY = '/var/appdata/95/idx',
      PARTITION p2000 VALUES IN (1996, 2000, 2004)
        DATA DIRECTORY = '/var/appdata/96/data'
        INDEX DIRECTORY = '/var/appdata/96/idx',
      PARTITION p2001 VALUES IN (1997, 2001, 2005)
        DATA DIRECTORY = '/var/appdata/97/data'
        INDEX DIRECTORY = '/var/appdata/97/idx',
      PARTITION p2002 VALUES IN (1998, 2002, 2006)
        DATA DIRECTORY = '/var/appdata/98/data'
        INDEX DIRECTORY = '/var/appdata/98/idx'
    );
    ```7hYaWn3Nj4```

A partição vê uma coluna gerada como uma coluna regular, o que permite contornar limitações em funções que não são permitidas para partição (veja a Seção 26.6.3, “Limitações de Partição Relativas a Funções”). O exemplo anterior demonstra essa técnica: `EXP()` não pode ser usado diretamente na cláusula `PARTITION BY`, mas uma coluna gerada definida usando `EXP()` é permitida.