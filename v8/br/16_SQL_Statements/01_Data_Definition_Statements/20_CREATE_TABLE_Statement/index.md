### 15.1.20 Declaração CREATE TABLE

15.1.20.1 Arquivos criados por CREATE TABLE

15.1.20.2 Declaração de Criação de Tabela Temporária

15.1.20.3 CREATE TABLE ... LIKE Instrução

15.1.20.4 CRIAR Tabela ... Instrução SELECT

15.1.20.5 Restrições de Chave Estrangeira

15.1.20.6 Restrições de verificação

15.1.20.7 Alterações nas especificações da coluna silenciosa

15.1.20.8 Criar uma tabela e colunas geradas

15.1.20.9 Índices Secundários e Colunas Geradas

15.1.20.10 Colunas Invisíveis

15.1.20.11 Chaves primárias invisíveis geradas

15.1.20.12 Configuração das Opções de Comentário do NDB

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

`CREATE TABLE` cria uma tabela com o nome fornecido. Você deve ter o privilégio `CREATE` para a tabela.

Por padrão, as tabelas são criadas no banco de dados padrão, usando o mecanismo de armazenamento `InnoDB`. Um erro ocorre se a tabela já existir, se não houver um banco de dados padrão ou se o banco de dados não existir.

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam as tabelas. Os motores de armazenamento individuais podem impor restrições específicas ao motor. `InnoDB` permite até 4 bilhões de tabelas.

Para obter informações sobre a representação física de uma tabela, consulte a Seção 15.1.20.1, “Arquivos criados por CREATE TABLE”.

Há vários aspectos da declaração `CREATE TABLE`, descritos nos seguintes tópicos desta seção:

- Nome da tabela
- Tabelas Temporárias
- Clonagem e cópia de tabela
- Tipos de dados de colunas e atributos
- Índices, Chaves Estrangeiras e Restrições CHECK
- Opções da tabela
- Divisão de tabela

#### Nome da tabela

- `tbl_name`

  O nome da tabela pode ser especificado como `db_name.tbl_name` para criar a tabela em um banco de dados específico. Isso funciona independentemente de existir um banco de dados padrão, assumindo que o banco de dados exista. Se você usar identificadores com aspas, aspas aspas os nomes do banco de dados e da tabela separadamente. Por exemplo, escreva `` `mydb`.`mytbl` ``, não `` `mydb.mytbl` ``.

  As regras para nomes de tabelas permitidos estão descritas na Seção 11.2, "Nomes de Objetos do Schema".

- `IF NOT EXISTS`

  Previne ocorrência de um erro se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica à indicada pela declaração `CREATE TABLE`.

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Para mais informações, consulte a Seção 15.1.20.2, “Instrução CREATE TEMPORARY TABLE”.

#### Clonagem e cópia de tabela

- `LIKE`

  Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

  ```
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

  Para obter mais informações, consulte a Seção 15.1.20.3, “Instrução CREATE TABLE ... LIKE”.

- `[AS] query_expression`

  Para criar uma tabela a partir de outra, adicione uma declaração `SELECT` no final da declaração `CREATE TABLE`:

  ```
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

  Para obter mais informações, consulte a Seção 15.1.20.4, “Instrução CREATE TABLE ... SELECT”.

- `IGNORE | REPLACE`

  As opções `IGNORE` e `REPLACE` indicam como lidar com linhas que duplicam valores de chave única ao copiar uma tabela usando uma declaração `SELECT`.

  Para obter mais informações, consulte a Seção 15.1.20.4, “Instrução CREATE TABLE ... SELECT”.

#### Tipos de dados de colunas e atributos

Há um limite máximo de 4096 colunas por tabela, mas o limite efetivo pode ser menor para uma tabela específica e depende dos fatores discutidos na Seção 10.4.7, “Limites de Contagem de Colunas e Tamanho de Linhas de Tabela”.

- `data_type`

  `data_type` representa o tipo de dados em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de coluna, bem como informações sobre as propriedades de cada tipo, consulte o Capítulo 13, *Tipos de Dados*.

  - Alguns atributos não se aplicam a todos os tipos de dados. `AUTO_INCREMENT` se aplica apenas aos tipos inteiro e ponto flutuante. O uso de `AUTO_INCREMENT` com `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") colunas é desaconselhável a partir do MySQL 8.0.17; espera-se que o suporte para isso seja removido em uma versão futura do MySQL.

    Antes do MySQL 8.0.13, `DEFAULT` não se aplica aos tipos `BLOB`, `TEXT`, `GEOMETRY` e `JSON`.

  - Os tipos de dados de caracteres (os tipos `CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo de `CHARACTER SET`. Uma collation para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para obter detalhes, consulte o Capítulo 12, *Conjunto de caracteres, collation, Unicode*. Exemplo:

    ```
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
    ```

    O MySQL 8.0 interpreta as especificações de comprimento nas definições de colunas de caracteres em caracteres. Os comprimentos para `BINARY` e `VARBINARY` são em bytes.

  - Para as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`, podem ser criados índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice. As colunas `BLOB` e `TEXT` também podem ser indexadas, mas um comprimento de prefixo *deve* ser fornecido. Os comprimentos de prefixo são fornecidos em caracteres para tipos de strings não binários e em bytes para tipos de strings binárias. Ou seja, as entradas do índice consistem nos primeiros `length` caracteres de cada valor da coluna para as colunas `CHAR`, `VARCHAR` e `TEXT`, e nos primeiros `length` bytes de cada valor da coluna para as colunas `BINARY`, `VARBINARY` e `BLOB`. Indexar apenas um prefixo dos valores das colunas dessa forma pode tornar o arquivo de índice muito menor. Para obter informações adicionais sobre prefixos de índice, consulte a Seção 15.1.15, “Instrução CREATE INDEX”.

    Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam indexação nas colunas `BLOB` e `TEXT`. Por exemplo:

    ```
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

    Se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, o `CREATE TABLE` trata o índice da seguinte forma:

    - Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver ativado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dado da coluna e uma mensagem de aviso é exibida (se o modo SQL rigoroso não estiver ativado).

    - Para um índice único, um erro ocorre independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

  - As colunas `JSON` não podem ser indexadas. Você pode contornar essa restrição criando um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Veja Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

- `NOT NULL | NULL`

  Se nem `NULL` nem `NOT NULL` forem especificados, a coluna será tratada como se `NULL` tivesse sido especificada.

  No MySQL 8.0, apenas os mecanismos de armazenamento `InnoDB`, `MyISAM` e `MEMORY` suportam índices em colunas que podem ter valores de `NULL`. Em outros casos, você deve declarar as colunas indexadas como `NOT NULL` ou ocorrerá um erro.

- `DEFAULT`

  Especifica um valor padrão para uma coluna. Para obter mais informações sobre o tratamento de valores padrão, incluindo o caso em que uma definição de coluna não inclui um valor explícito de `DEFAULT`, consulte a Seção 13.6, “Valores padrão de tipo de dados”.

  Se o modo SQL `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE` estiver habilitado e um valor padrão com data não estiver correto de acordo com esse modo, `CREATE TABLE` emite uma mensagem de alerta se o modo SQL rigoroso não estiver habilitado e um erro se o modo rigoroso estiver habilitado. Por exemplo, com `NO_ZERO_IN_DATE` habilitado, `c1 DATE DEFAULT '2010-00-00'` emite uma mensagem de alerta.

- `VISIBLE`, `INVISIBLE`

  Especifique a visibilidade da coluna. O padrão é `VISIBLE` se nenhuma palavra-chave estiver presente. Uma tabela deve ter pelo menos uma coluna visível. Tentar tornar todas as colunas invisíveis produz um erro. Para mais informações, consulte a Seção 15.1.20.10, “Colunas Invisíveis”.

  As palavras-chave `VISIBLE` e `INVISIBLE` estão disponíveis a partir do MySQL 8.0.23. Antes do MySQL 8.0.23, todas as colunas são visíveis.

- `AUTO_INCREMENT`

  Uma coluna de número inteiro ou ponto flutuante pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor de `NULL` (recomendado) ou `0` em uma coluna indexada `AUTO_INCREMENT`, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `value+1`, onde `value` é o maior valor para a coluna atualmente na tabela. As sequências `AUTO_INCREMENT` começam com `1`.

  Para recuperar um valor `AUTO_INCREMENT` após inserir uma linha, use a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Veja a Seção 14.15, “Funções de Informação”, e mysql\_insert\_id().

  Se o modo SQL `NO_AUTO_VALUE_ON_ZERO` estiver habilitado, você pode armazenar `0` nas colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor de sequência. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

  Só pode haver uma coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver apenas valores positivos. Inserir um número negativo é considerado como inserir um número positivo muito grande. Isso é feito para evitar problemas de precisão quando os números "voltam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

  Para tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Veja a Seção 5.6.9, “Usando AUTO\_INCREMENT”.

  Para tornar o MySQL compatível com algumas aplicações ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última linha inserida com a seguinte consulta:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Esse método exige que a variável `sql_auto_is_null` não esteja definida como 0. Consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

  Para informações sobre `InnoDB` e `AUTO_INCREMENT`, consulte a Seção 17.6.1.6, “Tratamento de AUTO\_INCREMENT no InnoDB”. Para informações sobre `AUTO_INCREMENT` e a replicação do MySQL, consulte a Seção 19.5.1.1, “Replicação e AUTO\_INCREMENT”.

- `COMMENT`

  Um comentário para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres. O comentário é exibido pelas instruções `SHOW CREATE TABLE` e `SHOW FULL COLUMNS`. Ele também é exibido na coluna `COLUMN_COMMENT` da tabela do Schema de Informações `COLUMNS`.

- `COLUMN_FORMAT`

  No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais das tabelas `NDB` usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar armazenamento de largura fixa, `DYNAMIC` permite que a coluna seja de largura variável e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável, conforme determinado pelo tipo de dados da coluna (possivelmente sobrescrito por um especificador `ROW_FORMAT`).

  Para as tabelas `NDB`, o valor padrão para `COLUMN_FORMAT` é `FIXED`.

  No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para obter mais informações e possíveis soluções, consulte a Seção 25.2.7.5, “Limites associados aos objetos de banco de dados no NDB Cluster”.

  `COLUMN_FORMAT` atualmente não tem efeito em colunas de tabelas que utilizam motores de armazenamento diferentes de `NDB`. O MySQL 8.0 ignora silenciosamente `COLUMN_FORMAT`.

- As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de coluna para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLE t1 (c1 INT ENGINE_ATTRIBUTE='{"key":"value"}');
  ```

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erros. Nesse caso, o último valor especificado é usado.

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

- `STORAGE`

  Para as tabelas `NDB`, é possível especificar se a coluna é armazenada no disco ou na memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada no disco e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. A instrução `CREATE TABLE` usada ainda deve incluir uma cláusula `TABLESPACE`:

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

  Para as tabelas `NDB`, `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

  A cláusula `STORAGE` não tem efeito em tabelas que utilizam outros motores de armazenamento além de `NDB`. A palavra-chave `STORAGE` é suportada apenas na versão do **mysqld** fornecida com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

- `GENERATED ALWAYS`

  Usado para especificar uma expressão de coluna gerada. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

  Colunas geradas armazenadas podem ser indexadas. `InnoDB` suporta índices secundários em colunas geradas virtuais. Veja a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

#### Índices, Chaves Estrangeiras e Restrições CHECK

Várias palavras-chave se aplicam à criação de índices, chaves estrangeiras e restrições `CHECK`. Para informações gerais, além das descrições a seguir, consulte a Seção 15.1.15, “Instrução CREATE INDEX”, a Seção 15.1.20.5, “Restrições de chave estrangeira” e a Seção 15.1.20.6, “Restrições CHECK”.

- `CONSTRAINT symbol`

  A cláusula `CONSTRAINT symbol` pode ser usada para nomear uma restrição. Se a cláusula não for fornecida ou se um `symbol` não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição, com a exceção mencionada abaixo. O valor `symbol`, se usado, deve ser único por esquema (banco de dados), por tipo de restrição. Um `symbol` duplicado resulta em um erro. Veja também a discussão sobre os limites de comprimento dos identificadores de restrições na Seção 11.2.1, “Limites de comprimento do identificador”.

  Nota

  Se a cláusula `CONSTRAINT symbol` não for fornecida em uma definição de chave estrangeira, ou se um `symbol` não for incluído após a palavra-chave `CONSTRAINT`, o MySQL usa o nome do índice da chave estrangeira até o MySQL 8.0.15 e gera automaticamente um nome de restrição posteriormente.

  O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas as restrições de diferentes tipos podem ter o mesmo nome.

- `PRIMARY KEY`

  Um índice único onde todas as colunas principais devem ser definidas como `NOT NULL`. Se elas não forem declaradas explicitamente como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas um `PRIMARY KEY`. O nome de um `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como nome para qualquer outro tipo de índice.

  Se você não tiver um `PRIMARY KEY` e um aplicativo solicitar o `PRIMARY KEY` em suas tabelas, o MySQL retorna o primeiro índice `UNIQUE` que não tenha colunas `NULL` como o `PRIMARY KEY`.

  Nas tabelas `InnoDB`, mantenha o `PRIMARY KEY` curto para minimizar o overhead de armazenamento para índices secundários. Cada entrada de índice secundário contém uma cópia das colunas da chave primária da linha correspondente. (Veja a Seção 17.6.2.1, “Índices Clustered e Secundários”.)

  Na tabela criada, um `PRIMARY KEY` é colocado primeiro, seguido de todos os índices `UNIQUE`, e depois os índices não exclusivos. Isso ajuda o otimizador do MySQL a priorizar qual índice usar e também a detectar mais rapidamente chaves duplicadas `UNIQUE`.

  Um `PRIMARY KEY` pode ser um índice de múltiplas colunas. No entanto, você não pode criar um índice de múltiplas colunas usando o atributo de chave `PRIMARY KEY` em uma especificação de coluna. Isso apenas marca essa única coluna como primária. Você deve usar uma cláusula separada `PRIMARY KEY(key_part, ...)`.

  Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

  No MySQL, o nome de um `PRIMARY KEY` é `PRIMARY`. Para outros índices, se você não atribuir um nome, o índice receberá o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo único. Você pode ver os nomes dos índices de uma tabela usando `SHOW INDEX FROM tbl_name`. Veja a Seção 15.7.7.22, “Instrução SHOW INDEX”.

- `KEY | INDEX`

  `KEY` é normalmente um sinônimo de `INDEX`. O atributo chave `PRIMARY KEY` também pode ser especificado como apenas `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros sistemas de banco de dados.

- `UNIQUE`

  Um índice `UNIQUE` cria uma restrição de forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Para todos os motores, um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor de prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo.

  Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

- `FULLTEXT`

  Um índice `FULLTEXT` é um tipo especial de índice usado para pesquisas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT`. Eles podem ser criados apenas a partir de colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna; a indexação com prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 14.9, “Funções de Pesquisa de Texto Completo”, para obter detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um valor `index_option` para associar um plugin de analisador ao índice se as operações de indexação e pesquisa de texto completo precisarem de tratamento especial. Esta cláusula é válida apenas para índices `FULLTEXT`. Os plugins de analisador de texto completo `InnoDB` e `MyISAM` suportam plugins de analisador de texto completo. Consulte Plugins de Analisador de Texto Completo e Escrevendo Plugins de Analisador de Texto Completo para obter mais informações.

- `SPATIAL`

  Você pode criar índices `SPATIAL` em tipos de dados espaciais. Os tipos espaciais são suportados apenas para tabelas `InnoDB` e `MyISAM`, e as colunas indexadas devem ser declaradas como `NOT NULL`. Veja a Seção 13.4, “Tipos de Dados Espaciais”.

- `FOREIGN KEY`

  O MySQL suporta chaves estrangeiras, que permitem cruzar dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter esses dados dispersos consistentes. Para informações sobre definição e opções, consulte `reference_definition` e `reference_option`.

  As tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Consulte a Seção 26.6, “Restrições e Limitações na Particionamento”, para obter mais informações.

- `CHECK`

  A cláusula `CHECK` permite a criação de restrições a serem verificadas para os valores de dados nas linhas da tabela. Veja a Seção 15.1.20.6, “Restrições CHECK”.

- `key_part`

  - Uma especificação `key_part` pode terminar com `ASC` ou `DESC` para especificar se os valores de índice são armazenados em ordem crescente ou decrescente. O padrão é crescente se nenhum especificador de ordem for fornecido.

  - Os prefixos, definidos pelo atributo `length`, podem ter até 767 bytes de comprimento para tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para tabelas `InnoDB` que utilizam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes.

    Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de strings não binárias (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  - A partir do MySQL 8.0.17, o `expr` para uma especificação `key_part` pode assumir a forma `(CAST json_path AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Índices de Múltiplos Valores fornece informações detalhadas sobre a criação, uso e restrições e limitações de índices de múltiplos valores.

- `index_type`

  Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador `index_type` é `USING type_name`.

  Exemplo:

  ```
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
  ```

  A posição preferida para `USING` é após a lista de colunas de índice. Pode ser dada antes da lista de colunas, mas o suporte para o uso da opção nessa posição é desaconselhável e você deve esperar que ela seja removida em uma futura versão do MySQL.

- `index_option`

  Os valores de `index_option` especificam opções adicionais para um índice.

  - `KEY_BLOCK_SIZE`

    Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor `KEY_BLOCK_SIZE` do nível da tabela.

    Para obter informações sobre o atributo `KEY_BLOCK_SIZE` de nível de tabela, consulte Opções de tabela.

  - `WITH PARSER`

    A opção `WITH PARSER` pode ser usada apenas com índices `FULLTEXT`. Ela associa um plugin de processamento de texto ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. Os índices `InnoDB` e `MyISAM` suportam plugins de processamento de texto de texto completo. Se você tiver uma tabela `MyISAM` com um plugin de processamento de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

  - `COMMENT`

    As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

    Você pode definir o valor `InnoDB` `MERGE_THRESHOLD` para um índice individual usando a cláusula `index_option` `COMMENT`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

  - `VISIBLE`, `INVISIBLE`

    Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é usado pelo otimizador. A especificação da visibilidade do índice se aplica a índices que não sejam chaves primárias (explícitos ou implícitos). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

  - As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  Para obter mais informações sobre os valores permitidos de `index_option`, consulte a Seção 15.1.15, “Instrução CREATE INDEX”. Para obter mais informações sobre índices, consulte a Seção 10.3.1, “Como o MySQL usa índices”.

- `reference_definition`

  Para detalhes e exemplos de sintaxe de `reference_definition`, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

  As tabelas `InnoDB` e `NDB` suportam a verificação de restrições de chave estrangeira. As colunas da tabela referenciada devem sempre ser nomeadas explicitamente. As ações `ON DELETE` e `ON UPDATE` sobre chaves estrangeiras são suportadas. Para informações mais detalhadas e exemplos, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

  Para outros motores de armazenamento, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas instruções `CREATE TABLE`.

  Importante

  Para usuários familiarizados com o padrão ANSI/ISO SQL, observe que nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula explícita `MATCH` não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, a especificação de `MATCH` deve ser evitada.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplos colunas) são tratados ao serem comparados com uma chave primária. `InnoDB` implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja totalmente ou parcialmente `NULL`. Nesse caso, a linha da tabela (filha) que contém essa chave estrangeira é permitida para ser inserida e não corresponde a nenhuma linha na tabela referenciada (mãe). É possível implementar outras semânticas usando gatilhos.

  Além disso, o MySQL exige que as colunas referenciadas estejam indexadas para garantir o desempenho. No entanto, o `InnoDB` não exige que as colunas referenciadas sejam declaradas como `UNIQUE` ou `NOT NULL`. O tratamento de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores de `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você deve usar chaves estrangeiras que referenciam apenas chaves que sejam tanto `UNIQUE` (ou `PRIMARY`) quanto `NOT NULL`.

  O MySQL analisa, mas ignora as especificações “inline `REFERENCES`” (conforme definido no padrão SQL), onde as referências são definidas como parte da especificação da coluna. O MySQL aceita as cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada. Para mais informações, consulte a Seção 1.6.2.3, “Diferenças na restrição FOREIGN KEY”.

- `reference_option`

  Para obter informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

#### Opções da tabela

As opções da tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os motores de armazenamento, a menos que indicado de outra forma. Opções que não se aplicam a um determinado motor de armazenamento podem ser aceitas e lembradas como parte da definição da tabela. Essas opções então se aplicam se você usar `ALTER TABLE` posteriormente para converter a tabela para usar um motor de armazenamento diferente.

- `ENGINE`

  Especifica o mecanismo de armazenamento para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do mecanismo pode ser não citado ou citado. O nome citado `'DEFAULT'` é reconhecido, mas ignorado.

  <table summary="Nomes dos motores de armazenamento permitidos para a opção de tabela ENGINE e uma descrição de cada motor."><thead><tr> <th>Motor de Armazenamento</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>MERGE</code>]</td> <td>Tabelas seguras para transações com bloqueio de linhas e chaves estrangeiras. O mecanismo de armazenamento padrão para novas tabelas. Veja o Capítulo 17,<i>O Motor de Armazenamento InnoDB</i>, e, em particular, a Seção 17.1, “Introdução ao InnoDB”, se você tem experiência com o MySQL, mas é novo no [[PH_HTML_CODE_<code>MERGE</code>].</td> </tr><tr> <td>[[PH_HTML_CODE_<code>MRG_MyISAM</code>]</td> <td>O motor de armazenamento portátil binário que é utilizado principalmente para cargas de trabalho de leitura somente ou quase exclusiva. Veja a Seção 18.2, “O Motor de Armazenamento MyISAM”.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>NDB</code>]</td> <td>Os dados deste motor de armazenamento são armazenados apenas na memória. Consulte a Seção 18.3, “O Motor de Armazenamento de MEMÓRIA”.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>NDBCLUSTER</code>]</td> <td>Tabelas que armazenam linhas no formato de valores separados por vírgula. Veja a Seção 18.4, “O Motor de Armazenamento CSV”.</td> </tr><tr> <td>[[<code>ARCHIVE</code>]]</td> <td>O mecanismo de armazenamento de arquivamento. Veja a Seção 18.5, “O Mecanismo de Armazenamento ARCHIVE”.</td> </tr><tr> <td>[[<code>EXAMPLE</code>]]</td> <td>Um exemplo de motor. Veja a Seção 18.9, “O Motor de Armazenamento EXAMPLE”.</td> </tr><tr> <td>[[<code>FEDERATED</code>]]</td> <td>Motor de armazenamento que acessa tabelas remotas. Veja a Seção 18.8, “O Motor de Armazenamento FEDERATED”.</td> </tr><tr> <td>[[<code>HEAP</code>]]</td> <td>Este é um sinônimo de [[<code>MEMORY</code>]].</td> </tr><tr> <td>[[<code>MERGE</code>]]</td> <td>Uma coleção de tabelas [[<code>InnoDB</code><code>MERGE</code>] usadas como uma única tabela. Também conhecida como [[<code>MRG_MyISAM</code>]]. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.</td> </tr><tr> <td>[[<code>NDB</code>]]</td> <td>Tabelas baseadas em memória, distribuídas, tolerantes a falhas e que suportam transações e chaves estrangeiras. Também conhecidas como [[<code>NDBCLUSTER</code>]]. Veja o Capítulo 25.<i>MySQL NDB Cluster 8.0</i>.</td> </tr></tbody></table>

  Por padrão, se um mecanismo de armazenamento for especificado que não está disponível, a instrução falha com um erro. Você pode sobrepor esse comportamento removendo `NO_ENGINE_SUBSTITUTION` do modo SQL do servidor (consulte a Seção 7.1.11, “Modos SQL do Servidor”) para que o MySQL permita a substituição do mecanismo especificado pelo mecanismo de armazenamento padrão. Normalmente, nesse caso, é `InnoDB`, que é o valor padrão para a variável de sistema `default_storage_engine`. Quando `NO_ENGINE_SUBSTITUTION` é desativado, uma mensagem de aviso ocorre se a especificação do mecanismo de armazenamento não for respeitada.

- `AUTOEXTEND_SIZE`

  Define a quantidade pela qual `InnoDB` estende o tamanho do espaço de tabelas quando ele fica cheio. Introduzido no MySQL 8.0.23. O ajuste deve ser um múltiplo de 4 MB. O ajuste padrão é 0, o que faz com que o espaço de tabelas seja estendido de acordo com o comportamento padrão implícito. Para mais informações, consulte a Seção 17.6.3.9, “Configuração de AUTOEXTEND\_SIZE do Espaço de Tabelas”.

- `AUTO_INCREMENT`

  O valor inicial `AUTO_INCREMENT` para a tabela. No MySQL 8.0, isso funciona para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor de autoincremento para motores que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma linha "falsa" com um valor menor que o desejado após a criação da tabela e, em seguida, exclua a linha falsa.

  Para motores que suportam a opção da tabela `AUTO_INCREMENT` nas instruções `CREATE TABLE`, você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor de `AUTO_INCREMENT`. O valor não pode ser definido como menor que o valor máximo atualmente na coluna.

- `AVG_ROW_LENGTH`

  Uma aproximação da duração média da linha da sua tabela. Você precisa definir isso apenas para tabelas grandes com linhas de tamanho variável.

  Quando você cria uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir o tamanho da tabela resultante. Se você não especificar nenhuma dessas opções, o tamanho máximo para os arquivos de dados e índice `MyISAM` é de 256TB por padrão. (Se o seu sistema operacional não suportar arquivos tão grandes, os tamanhos das tabelas são limitados pelo limite de tamanho do arquivo.) Se você deseja manter os tamanhos dos ponteiros reduzidos para tornar o índice menor e mais rápido e não precisa realmente de grandes arquivos, você pode diminuir o tamanho padrão do ponteiro configurando a variável de sistema `myisam_data_pointer_size`. (Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.) Se você deseja que todas as suas tabelas possam crescer acima do limite padrão e está disposto a ter suas tabelas um pouco mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro configurando essa variável. Definir o valor para 7 permite tamanhos de tabela de até 65.536TB.

- `[DEFAULT] CHARACTER SET`

  Especifica um conjunto de caracteres padrão para a tabela. `CHARSET` é sinônimo de `CHARACTER SET`. Se o nome do conjunto de caracteres for `DEFAULT`, o conjunto de caracteres do banco de dados é usado.

- `CHECKSUM`

  Defina este valor para 1 se quiser que o MySQL mantenha um checksum em tempo real para todas as linhas (ou seja, um checksum que o MySQL atualiza automaticamente à medida que a tabela muda). Isso torna a tabela um pouco mais lenta para atualização, mas também facilita a localização de tabelas corrompidas. A instrução `CHECKSUM TABLE` relata o checksum. (Apenas `MyISAM`.)

- `[DEFAULT] COLLATE`

  Especifica uma ordenação padrão para a tabela.

- `COMMENT`

  Um comentário para a tabela, com até 2048 caracteres.

  Você pode definir o valor `InnoDB` `MERGE_THRESHOLD` para uma tabela usando a cláusula `table_option` `COMMENT`. Veja a Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

  **Definindo as opções NDB\_TABLE.**

  O comentário da tabela em um `CREATE TABLE` que cria uma tabela `NDB` ou uma instrução `ALTER TABLE` que altera uma também pode ser usado para especificar de um a quatro dos `NDB_TABLE` opções `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED` como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a string `NDB_TABLE=` que inicia o texto do comentário citado. Um exemplo de declaração usando essa sintaxe é mostrado aqui (texto em destaque):

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

  Espaços não são permitidos dentro da string entre aspas. A string é case-insensitive.

  O comentário é exibido como parte da saída do `SHOW CREATE TABLE`. O texto do comentário também está disponível como a coluna TABLE\_COMMENT da tabela Schema de Informações do MySQL `TABLES`.

  Essa sintaxe de comentário também é suportada com declarações `ALTER TABLE` para tabelas `NDB`. Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter tido anteriormente.

  Definir a opção `MERGE_THRESHOLD` nos comentários da tabela não é suportado para tabelas `NDB` (é ignorado).

  Para obter informações completas sobre sintaxe e exemplos, consulte a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”.

- `COMPRESSION`

  O algoritmo de compressão usado para a compressão de nível de página para as tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com o recurso de compressão transparente de páginas. A compressão de páginas só é suportada com tabelas `InnoDB` que residem em espaços de tabelas por arquivo e está disponível apenas em plataformas Linux e Windows que suportam arquivos esparsos e perfuração de buracos. Para mais informações, consulte a Seção 17.9.2, “Compressão de Páginas InnoDB”.

- `CONNECTION`

  A cadeia de conexão para uma tabela `FEDERATED`.

  Nota

  Versões mais antigas do MySQL usavam uma opção `COMMENT` na string de conexão.

- `DATA DIRECTORY`, `INDEX DIRECTORY`

  Para `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite a criação de tabelas fora do diretório de dados. A variável `innodb_file_per_table` deve estar habilitada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado. A partir do MySQL 8.0.21, o diretório especificado deve ser conhecido por `InnoDB`. Para mais informações, consulte a Seção 17.6.1.2, “Criando Tabelas Externamente”.

  Ao criar tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de índice de uma tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondem ao nome do banco de dados ao criar uma tabela `MyISAM` com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

  Você deve ter o privilégio `FILE` para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

  Importante

  As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas para tabelas particionadas. (Bug #32091)

  Essas opções funcionam apenas quando você não está usando a opção `--skip-symbolic-links`. Seu sistema operacional também deve ter uma chamada `realpath()` segura para threads. Consulte a Seção 10.12.2.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix”, para obter informações mais completas.

  Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo existente `.MYD` neste caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção `--keep_files_on_create`, caso em que `MyISAM` não sobrescreverá arquivos existentes e retornará um erro.

  Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo existente `.MYD` ou `.MYI` for encontrado, `MyISAM` sempre retorna um erro e não sobrescreve um arquivo no diretório especificado.

  Importante

  Você não pode usar nomes de caminho que contenham o diretório de dados MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e particionamentos de tabelas individuais. (Veja o bug #32167.)

- `DELAY_KEY_WRITE`

  Defina este valor para 1 se quiser adiar as atualizações principais da tabela até que a tabela seja fechada. Consulte a descrição da variável de sistema `delay_key_write` na Seção 7.1.8, “Variáveis do Sistema do Servidor”. (Apenas `MyISAM`.)

- `ENCRYPTION`

  A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave de criptografia deve ser instalado e configurado antes que a criptografia possa ser habilitada. Antes do MySQL 8.0.16, a cláusula `ENCRYPTION` só pode ser especificada ao criar uma tabela em um espaço de tabelas por arquivo. A partir do MySQL 8.0.16, a cláusula `ENCRYPTION` também pode ser especificada ao criar uma tabela em um espaço de tabelas geral.

  A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se o motor de armazenamento padrão for `InnoDB`, ou se a instrução `CREATE TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a instrução é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

  A partir do MySQL 8.0.16, uma tabela herda a criptografia de esquema padrão se uma cláusula `ENCRYPTION` não for especificada. Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para criar uma tabela com uma configuração da cláusula `ENCRYPTION` que difere da criptografia de esquema padrão. Ao criar uma tabela em um espaço de tabelas geral, a criptografia da tabela e do espaço de tabelas deve corresponder.

  A partir do MySQL 8.0.16, não é permitido especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` quando estiver usando um mecanismo de armazenamento que não suporte criptografia. Anteriormente, a cláusula era aceita.

  Para obter mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

- As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de tabela para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE TABLE t1 (c1 INT) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erros. Nesse caso, o último valor especificado é usado.

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

- `INSERT_METHOD`

  Se você deseja inserir dados em uma tabela `MERGE`, deve especificar com `INSERT_METHOD` a tabela na qual a linha deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use um valor de `FIRST` ou `LAST` para que as inserções sejam feitas na primeira ou última tabela, ou um valor de `NO` para impedir as inserções. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.

- `KEY_BLOCK_SIZE`

  Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor `KEY_BLOCK_SIZE` do nível da tabela.

  Para as tabelas `InnoDB`, `KEY_BLOCK_SIZE` especifica o tamanho da página em kilobytes a ser usado para as tabelas `InnoDB` compactadas. O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; um tamanho diferente pode ser usado por `InnoDB` se necessário. `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor `innodb_page_size`. Um valor de 0 representa o tamanho padrão da página compactada, que é metade do valor `innodb_page_size`. Dependendo de `innodb_page_size`, os possíveis valores de `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Consulte a Seção 17.9.1, “Compactação de Tabelas InnoDB”, para obter mais informações.

  A Oracle recomenda habilitar `innodb_strict_mode` ao especificar `KEY_BLOCK_SIZE` para tabelas `InnoDB`. Quando `innodb_strict_mode` está habilitado, especificar um valor inválido de `KEY_BLOCK_SIZE` retorna um erro. Se `innodb_strict_mode` estiver desativado, um valor inválido de `KEY_BLOCK_SIZE` resulta em um aviso, e a opção `KEY_BLOCK_SIZE` é ignorada.

  A coluna `Create_options` em resposta a `SHOW TABLE STATUS` relata o `KEY_BLOCK_SIZE` real usado pela tabela, assim como a coluna `SHOW CREATE TABLE`.

  `InnoDB` só suporta `KEY_BLOCK_SIZE` no nível da tabela.

  A compressão da tabela `KEY_BLOCK_SIZE` não é suportada com valores de `innodb_page_size` de 32 KB e 64 KB. A compressão da tabela `InnoDB` não suporta esses tamanhos de página.

  `InnoDB` não suporta a opção `KEY_BLOCK_SIZE` ao criar tabelas temporárias.

- `MAX_ROWS`

  O número máximo de linhas que você planeja armazenar na tabela. Esse não é um limite rígido, mas sim um indicativo para o mecanismo de armazenamento de que a tabela deve ser capaz de armazenar pelo menos esse número de linhas.

  Importante

  O uso de `MAX_ROWS` com tabelas `NDB` para controlar o número de partições de tabela é desaconselhável. Ele ainda é suportado em versões posteriores para compatibilidade com versões anteriores, mas está sujeito à remoção em uma futura versão. Use PARTITION\_BALANCE; veja Configurando as opções do NDB\_TABLE.

  O motor de armazenamento `NDB` trata esse valor como um máximo. Se você planeja criar tabelas muito grandes do NDB Cluster (contendo milhões de linhas), você deve usar essa opção para garantir que `NDB` aloque um número suficiente de espaços de índice na tabela hash usada para armazenar os hashes das chaves primárias da tabela, definindo `MAX_ROWS = 2 * rows`, onde `rows` é o número de linhas que você espera inserir na tabela.

  O valor máximo do `MAX_ROWS` é 4294967295; valores maiores são truncados para esse limite.

- `MIN_ROWS`

  O número mínimo de linhas que você planeja armazenar na tabela. O mecanismo de armazenamento `MEMORY` usa essa opção como um indicativo sobre o uso de memória.

- `PACK_KEYS`

  É eficaz apenas com as tabelas `MyISAM`. Defina esta opção para 1 se desejar índices menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção para 0 desativa todo o empilhamento de chaves. Definir para `DEFAULT` indica ao motor de armazenamento que ele deve empilhar apenas colunas longas de `CHAR`, `VARCHAR`, `BINARY` ou `VARBINARY`.

  Se você não usar `PACK_KEYS`, o padrão é embalar strings, mas não números. Se você usar `PACK_KEYS=1`, os números também serão embalados.

  Ao embalar chaves de números binários, o MySQL usa compressão de prefixo:

  - Cada chave precisa de um byte extra para indicar quantos bytes da chave anterior são iguais para a próxima chave.

  - O ponteiro para a linha é armazenado em ordem de alto byte primeiro, diretamente após a chave, para melhorar a compressão.

  Isso significa que, se você tiver muitas chaves iguais em duas linhas consecutivas, todas as chaves seguintes geralmente levam apenas dois bytes (incluindo o ponteiro para a linha). Compare isso com o caso comum em que as chaves seguintes levam `storage_size_for_key + pointer_size` (onde o tamanho do ponteiro geralmente é 4). Por outro lado, você obtém um benefício significativo da compressão prefixada apenas se tiver muitos números iguais. Se todas as chaves forem totalmente diferentes, você usa um byte a mais por chave, se a chave não for uma chave que pode ter valores de `NULL`. (Neste caso, o comprimento da chave compactada é armazenado no mesmo byte que é usado para marcar se uma chave é `NULL`.)

- `PASSWORD`

  Esta opção não é utilizada.

- `ROW_FORMAT`

  Define o formato físico em que as linhas são armazenadas.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` em resposta ao `SHOW TABLE STATUS`. A coluna `Create_options` mostra o formato de linha que foi especificado na declaração `CREATE TABLE`, assim como a `SHOW CREATE TABLE`.

  As opções de formato de linha diferem dependendo do mecanismo de armazenamento usado para a tabela.

  Para tabelas `InnoDB`:

  - O formato de linha padrão é definido por `innodb_default_row_format`, que tem um ajuste padrão de `DYNAMIC`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` não é definida ou quando `ROW_FORMAT=DEFAULT` é usada.

    Se a opção `ROW_FORMAT` não for definida ou se `ROW_FORMAT=DEFAULT` for usada, as operações que reconstruem uma tabela também alteram silenciosamente o formato da linha da tabela para o padrão definido por `innodb_default_row_format`. Para obter mais informações, consulte Definindo o Formato da Linha de uma Tabela.

  - Para um armazenamento mais eficiente dos tipos de dados, especialmente os tipos `BLOB`, use o `DYNAMIC`. Consulte o Formato Dinâmico de Linha para requisitos associados ao formato de linha `DYNAMIC`.

  - Para habilitar a compressão para as tabelas `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. A opção `ROW_FORMAT=COMPRESSED` não é suportada ao criar tabelas temporárias. Consulte a Seção 17.9, “Compressão de Tabela e Página InnoDB”, para obter informações sobre os requisitos associados ao formato da linha `COMPRESSED`.

  - O formato de linha usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o formato de linha `REDUNDANT`.

  - Quando você especificar uma cláusula `ROW_FORMAT` não padrão, considere também habilitar a opção de configuração `innodb_strict_mode`.

  - `ROW_FORMAT=FIXED` não é suportado. Se `ROW_FORMAT=FIXED` for especificado enquanto `innodb_strict_mode` está desativado, `InnoDB` emite uma mensagem de aviso e assume `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` for especificado enquanto `innodb_strict_mode` está habilitado, o que é o padrão, `InnoDB` retorna um erro.

  - Para obter informações adicionais sobre os formatos de linha `InnoDB`, consulte a Seção 17.10, “Formatos de Linha InnoDB”.

  Para as tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para formatos de linha estáticos ou de comprimento variável. O **myisampack** define o tipo como `COMPRESSED`. Veja a Seção 18.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

  Para as tabelas `NDB`, o `ROW_FORMAT` padrão é `DYNAMIC`.

- `START TRANSACTION`

  Esta é uma opção de tabela para uso interno. Foi introduzida no MySQL 8.0.21 para permitir que `CREATE TABLE ... SELECT` seja registrado como uma única transação atômica no log binário ao usar a replicação baseada em linhas com um mecanismo de armazenamento que suporte DDL atômico. Somente as instruções `BINLOG`, `COMMIT` e `ROLLBACK` são permitidas após `CREATE TABLE ... START TRANSACTION`. Para informações relacionadas, consulte a Seção 15.1.1, “Suporte à Instrução de Definição de Dados Atômicos”.

- `STATS_AUTO_RECALC`

  Especifica se as estatísticas persistentes de uma tabela `InnoDB` devem ser recalculadas automaticamente. O valor `DEFAULT` determina que as configurações de estatísticas persistentes da tabela sejam determinadas pela opção de configuração `innodb_stats_auto_recalc`. O valor `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados na tabela forem alterados. O valor `0` impede a recalculação automática para esta tabela; com esta configuração, execute uma declaração `ANALYZE TABLE` para recalcular as estatísticas após fazer alterações substanciais na tabela. Para obter mais informações sobre o recurso de estatísticas persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `STATS_PERSISTENT`

  Especifica se os dados estatísticos persistentes devem ser habilitados para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste dos dados estatísticos persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_persistent`. O valor `1` habilita os dados estatísticos persistentes para a tabela, enquanto o valor `0` desabilita essa funcionalidade. Após habilitar os dados estatísticos persistentes por meio de uma declaração `CREATE TABLE` ou `ALTER TABLE`, execute uma declaração `ANALYZE TABLE` para calcular as estatísticas, após carregar dados representativos na tabela. Para obter mais informações sobre a funcionalidade de dados estatísticos persistentes, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- `STATS_SAMPLE_PAGES`

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizador Persistente”.

- `TABLESPACE`

  A cláusula `TABLESPACE` pode ser usada para criar uma tabela `InnoDB` em um espaço de tabelas geral existente, um espaço de tabelas por arquivo ou o espaço de tabelas do sistema.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

  O espaço de tabela geral que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para obter informações sobre espaços de tabela gerais, consulte a Seção 17.6.3.3, “Espaços de Tabela Geral”.

  O `tablespace_name` é um identificador sensível a maiúsculas e minúsculas. Ele pode ser citado ou não. O caractere barra invertida (“/”) não é permitido. Os nomes que começam com “innodb\_” são reservados para uso especial.

  Para criar uma tabela no espaço de tabela do sistema, especifique `innodb_system` como o nome do espaço de tabela.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

  Usando `TABLESPACE [=] innodb_system`, você pode inserir uma tabela de qualquer formato de linha não compactada no espaço de tabelas do sistema, independentemente da configuração `innodb_file_per_table`. Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao espaço de tabelas do sistema usando `TABLESPACE [=] innodb_system`.

  Para criar uma tabela em um espaço de tabela por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabela.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

  Nota

  Se `innodb_file_per_table` estiver habilitado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um espaço de tabela por arquivo. As tabelas `InnoDB` são criadas por padrão em espaços de tabela por arquivo quando `innodb_file_per_table` estiver habilitado.

  A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas não é suportada para uso em combinação com a cláusula `TABLESPACE`. A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

  Nota

  O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 8.0.13; espere que ele seja removido em uma versão futura do MySQL.

  A opção de tabela `STORAGE` é usada apenas com tabelas `NDB`. `STORAGE` determina o tipo de armazenamento utilizado e pode ser de `DISK` ou `MEMORY`.

  `TABLESPACE ... STORAGE DISK` atribui uma tabela a um espaço de dados de disco de cluster NDB. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por `TABLESPACE` `tablespace_name`.

  Para `STORAGE MEMORY`, o nome do tablespace é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está na memória.

  Consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”, para obter mais informações.

- `UNION`

  Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma única. Isso funciona apenas com tabelas `MERGE`. Veja a Seção 18.7, “O Motor de Armazenamento MERGE”.

  Você deve ter os privilégios `SELECT`, `UPDATE` e `DELETE` para as tabelas que você mapeia para uma tabela `MERGE`.

  Nota

  Anteriormente, todas as tabelas utilizadas tinham que estar no mesmo banco de dados que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Divisão de tabela

`partition_options` pode ser usado para controlar a partição da tabela criada com `CREATE TABLE`.

Nem todas as opções exibidas na sintaxe para `partition_options` no início desta seção estão disponíveis para todos os tipos de particionamento. Consulte as listagens para os seguintes tipos individuais para obter informações específicas para cada tipo, e consulte o Capítulo 26, *Particionamento*, para obter informações mais completas sobre o funcionamento e os usos do particionamento no MySQL, além de exemplos adicionais de criação de tabelas e outras declarações relacionadas ao particionamento do MySQL.

As partições podem ser modificadas, unidas, adicionadas a tabelas e removidas delas. Para obter informações básicas sobre as instruções MySQL para realizar essas tarefas, consulte a Seção 15.1.9, “Instrução ALTER TABLE”. Para descrições e exemplos mais detalhados, consulte a Seção 26.3, “Gestão de Partições”.

- `PARTITION BY`

  Se utilizada, uma cláusula `partition_options` começa com `PARTITION BY`. Esta cláusula contém a função que é usada para determinar a partição; a função retorna um valor inteiro variando de 1 a `num`, onde `num` é o número de partições. (O número máximo de partições definidas pelo usuário que uma tabela pode conter é de 1024; o número de subpartições — discutido mais adiante nesta seção — está incluído nesse máximo.)

  Nota

  A expressão (`expr`) usada em uma cláusula `PARTITION BY` não pode se referir a nenhuma coluna que não esteja na tabela que está sendo criada; tais referências não são permitidas especificamente e causam o erro na declaração. (Bug #29444)

- `HASH(expr)`

  Gera hashes de uma ou mais colunas para criar uma chave para a colocação e localização de linhas. `expr` é uma expressão que usa uma ou mais colunas da tabela. Isso pode ser qualquer expressão válida do MySQL (incluindo funções do MySQL) que produza um único valor inteiro. Por exemplo, estas são ambas declarações válidas `CREATE TABLE` usando `PARTITION BY HASH`:

  ```
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

  Você não pode usar as cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

  `PARTITION BY HASH` usa o resto de `expr` dividido pelo número de partições (ou seja, o módulo). Para exemplos e informações adicionais, consulte a Seção 26.2.4, “Partição HASH”.

  A palavra-chave `LINEAR` implica em um algoritmo um pouco diferente. Neste caso, o número da partição na qual uma linha é armazenada é calculado como o resultado de uma ou mais operações lógicas `AND`. Para discussão e exemplos de hashing linear, consulte a Seção 26.2.4.1, “Partição de Hash Linear”.

- `KEY(column_list)`

  Isso é semelhante ao `HASH`, exceto que o MySQL fornece a função de hashing para garantir uma distribuição de dados uniforme. O argumento `column_list` é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples dividida por chave, com 4 partições:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

  Para tabelas que são particionadas por chave, você pode usar a particionamento linear usando a palavra-chave `LINEAR`. Isso tem o mesmo efeito que para tabelas que são particionadas por `HASH`. Ou seja, o número da partição é encontrado usando o operador `&` em vez do módulo (consulte a Seção 26.2.4.1, “Particionamento Hash Linear”, e a Seção 26.2.5, “Particionamento por Chave”, para detalhes). Este exemplo usa o particionamento linear por chave para distribuir os dados entre 5 partições:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

  A opção `ALGORITHM={1 | 2}` é suportada com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chaves que o MySQL 5.1; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chaves implementadas e usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chaves empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada principalmente para uso ao atualizar ou desatualizar tabelas particionadas `[LINEAR] KEY` entre as versões do MySQL 5.1 e versões posteriores do MySQL, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1. Para mais informações, consulte a Seção 15.1.9.1, “Operações de Partição da Tabela”.

  O **mysqldump** escreve essa opção em comentários versionados.

  `ALGORITHM=1` é exibido quando necessário na saída de `SHOW CREATE TABLE` usando comentários versionados da mesma maneira que o **mysqldump**. `ALGORITHM=2` é sempre omitido da saída de `SHOW CREATE TABLE`, mesmo que essa opção tenha sido especificada ao criar a tabela original.

  Você não pode usar as cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY KEY`.

- `RANGE(expr)`

  Neste caso, `expr` mostra uma faixa de valores usando um conjunto de operadores `VALUES LESS THAN`. Ao usar a partição por faixa, você deve definir pelo menos uma partição usando `VALUES LESS THAN`. Você não pode usar `VALUES IN` com a partição por faixa.

  Nota

  Para tabelas particionadas por `RANGE`, `VALUES LESS THAN` deve ser usado com um valor literal inteiro ou uma expressão que avalie a um único valor inteiro. No MySQL 8.0, você pode superar essa limitação em uma tabela que é definida usando `PARTITION BY RANGE COLUMNS`, conforme descrito mais adiante nesta seção.

  Suponha que você tenha uma tabela que deseja particionar em uma coluna que contém valores de ano, de acordo com o seguinte esquema.

  <table summary="Um esquema de partição de tabela baseado em uma coluna que contém valores de ano, conforme descrito no texto anterior. A tabela lista os números de partição e o intervalo correspondente de anos."><thead><tr> <th>Número de Partição:</th> <th>Ano de produção:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 e anteriores</td> </tr><tr> <td>1</td> <td>1991 a 1994</td> </tr><tr> <td>2</td> <td>1995 a 1998</td> </tr><tr> <td>3</td> <td>1999 a 2002</td> </tr><tr> <td>4</td> <td>2003 a 2005</td> </tr><tr> <td>5</td> <td>2006 e depois</td> </tr></tbody></table>

  Uma tabela que implemente tal esquema de particionamento pode ser realizada pela declaração `CREATE TABLE` mostrada aqui:

  ```
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
  ```

  As declarações `PARTITION ... VALUES LESS THAN ...` funcionam de forma consecutiva. `VALUES LESS THAN MAXVALUE` funciona para especificar valores "remanescentes" que são maiores que o valor máximo especificado de outra forma.

  As cláusulas `VALUES LESS THAN` funcionam sequencialmente de maneira semelhante às partes `case` de um bloco `switch ... case` (como encontrado em muitos idiomas de programação, como C, Java e PHP). Ou seja, as cláusulas devem ser organizadas de tal forma que o limite superior especificado em cada `VALUES LESS THAN` sucessivo seja maior que o do anterior, com a que referencia `MAXVALUE` sendo a última de todas na lista.

- `RANGE COLUMNS(column_list)`

  Esta variante do `RANGE` facilita o corte de partições para consultas que utilizam condições de intervalo em várias colunas (ou seja, com condições como `WHERE a = 1 AND b < 10` ou `WHERE a = 1 AND b = 10 AND c < 10`). Permite que você especifique faixas de valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES LESS THAN (value_list)`. (No caso mais simples, esse conjunto consiste em uma única coluna.) O número máximo de colunas que podem ser referenciadas nos `column_list` e `value_list` é de 16.

  O `column_list` usado na cláusula `COLUMNS` pode conter apenas nomes de colunas; cada coluna na lista deve ser um dos seguintes tipos de dados do MySQL: os tipos inteiros; os tipos de string; e os tipos de coluna de hora ou data. Colunas que usam `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT` ou tipos de dados espaciais não são permitidas; colunas que usam tipos de números de ponto flutuante também não são permitidas. Você também não pode usar funções ou expressões aritméticas na cláusula `COLUMNS`.

  A cláusula `VALUES LESS THAN` usada em uma definição de partição deve especificar um valor literal para cada coluna que aparece na cláusula `COLUMNS()`; ou seja, a lista de valores usada para cada cláusula `VALUES LESS THAN` deve conter o mesmo número de valores que há de colunas listadas na cláusula `COLUMNS`. Uma tentativa de usar mais ou menos valores em uma cláusula `VALUES LESS THAN` do que há na cláusula `COLUMNS` causa a declaração a falhar com o erro Incoerência no uso de listas de colunas para particionamento.... Você não pode usar `NULL` para qualquer valor que apareça em `VALUES LESS THAN`. É possível usar `MAXVALUE` mais de uma vez para uma coluna dada, exceto a primeira, como mostrado neste exemplo:

  ```
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
  ```

  Cada valor usado em uma lista de valores `VALUES LESS THAN` deve corresponder exatamente ao tipo da coluna correspondente; nenhuma conversão é feita. Por exemplo, você não pode usar a string `'1'` para um valor que corresponda a uma coluna que usa um tipo inteiro (você deve usar o numeral `1` em vez disso), nem pode usar o numeral `1` para um valor que corresponda a uma coluna que usa um tipo de string (nesse caso, você deve usar uma string com aspas: `'1'`).

  Para obter mais informações, consulte a Seção 26.2.1, “Divisão de Faixa”, e a Seção 26.4, “Ramo de Partição”.

- `LIST(expr)`

  Isso é útil ao atribuir partições com base em uma coluna de tabela com um conjunto restrito de valores possíveis, como um código de estado ou país. Nesse caso, todas as linhas relacionadas a um determinado estado ou país podem ser atribuídas a uma única partição, ou uma partição pode ser reservada para um determinado conjunto de estados ou países. É semelhante ao `RANGE`, exceto que apenas `VALUES IN` pode ser usado para especificar valores permitidos para cada partição.

  `VALUES IN` é usado com uma lista de valores a serem correspondidos. Por exemplo, você pode criar um esquema de partição como o seguinte:

  ```
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
  ```

  Ao usar a partição de lista, você deve definir pelo menos uma partição usando `VALUES IN`. Você não pode usar `VALUES LESS THAN` com `PARTITION BY LIST`.

  Nota

  Para tabelas particionadas por `LIST`, a lista de valores usada com `VALUES IN` deve conter apenas valores inteiros. No MySQL 8.0, você pode superar essa limitação usando a particionamento por `LIST COLUMNS`, que é descrito mais adiante nesta seção.

- `LIST COLUMNS(column_list)`

  Esta variante do `LIST` facilita o corte de partições para consultas que utilizam condições de comparação em várias colunas (ou seja, com condições como `WHERE a = 5 AND b = 5` ou `WHERE a = 1 AND b = 10 AND c = 5`). Permite que você especifique valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES IN (value_list)`.

  As regras que regem os tipos de dados para a lista de colunas usadas em `LIST COLUMNS(column_list)` e a lista de valores usados em `VALUES IN(value_list)` são as mesmas que as usadas para a lista de colunas em `RANGE COLUMNS(column_list)` e a lista de valores em `VALUES LESS THAN(value_list)`, respectivamente, exceto que na cláusula `VALUES IN`, `MAXVALUE` não é permitido e você pode usar `NULL`.

  Há uma diferença importante entre a lista de valores usada para `VALUES IN` com `PARTITION BY LIST COLUMNS` em oposição a quando é usada com `PARTITION BY LIST`. Quando usada com `PARTITION BY LIST COLUMNS`, cada elemento na cláusula `VALUES IN` deve ser um *conjunto* de valores de coluna; o número de valores em cada conjunto deve ser o mesmo que o número de colunas usadas na cláusula `COLUMNS`, e os tipos de dados desses valores devem corresponder aos dos colunas (e ocorrer na mesma ordem). No caso mais simples, o conjunto consiste em uma única coluna. O número máximo de colunas que podem ser usadas no `column_list` e nos elementos que compõem o `value_list` é de 16.

  A tabela definida pela seguinte declaração `CREATE TABLE` fornece um exemplo de uma tabela usando a partição `LIST COLUMNS`:

  ```
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
  ```

- `PARTITIONS num`

  O número de partições pode ser especificado opcionalmente com uma cláusula `PARTITIONS num`, onde `num` é o número de partições. Se ambas esta cláusula *e* quaisquer cláusulas `PARTITION` forem usadas, `num` deve ser igual ao número total de quaisquer partições declaradas usando cláusulas `PARTITION`.

  Nota

  Se você usar ou não uma cláusula `PARTITIONS` ao criar uma tabela que é particionada por `RANGE` ou `LIST`, você ainda deve incluir pelo menos uma cláusula `PARTITION VALUES` na definição da tabela (veja abaixo).

- `SUBPARTITION BY`

  Uma partição pode ser dividida opcionalmente em vários subpartições. Isso pode ser indicado usando a cláusula opcional `SUBPARTITION BY`. A subpartição pode ser feita por `HASH` ou `KEY`. Qualquer uma dessas pode ser `LINEAR`. Eles funcionam da mesma maneira que foram descritos anteriormente para os tipos de partição equivalentes. (Não é possível subpartição por `LIST` ou `RANGE`.)

  O número de subpartições pode ser indicado usando a palavra-chave `SUBPARTITIONS` seguida de um valor inteiro.

- É aplicada uma verificação rigorosa do valor utilizado nas cláusulas `PARTITIONS` ou `SUBPARTITIONS` e esse valor deve seguir as seguintes regras:

  - O valor deve ser um inteiro positivo e não nulo.
  - Não são permitidos zeros significativos.
  - O valor deve ser um literal inteiro e não pode ser uma expressão. Por exemplo, `PARTITIONS 0.2E+01` não é permitido, mesmo que `0.2E+01` seja avaliado como `2`. (Bug #15890)

- `partition_definition`

  Cada partição pode ser definida individualmente usando uma cláusula `partition_definition`. As partes individuais que compõem essa cláusula são as seguintes:

  - `PARTITION partition_name`

    Especifica um nome lógico para a partição.

  - `VALUES`

    Para a partição por intervalo, cada partição deve incluir uma cláusula `VALUES LESS THAN`; para a partição por lista, você deve especificar uma cláusula `VALUES IN` para cada partição. Isso é usado para determinar quais linhas devem ser armazenadas nesta partição. Consulte as discussões sobre os tipos de partição no Capítulo 26, *Partição*, para exemplos de sintaxe.

  - `[STORAGE] ENGINE`

    O MySQL aceita a opção `[STORAGE] ENGINE` tanto para `PARTITION` quanto para `SUBPARTITION`. Atualmente, a única maneira de usar essa opção é definir todas as partições ou todas as subpartições no mesmo mecanismo de armazenamento, e uma tentativa de definir diferentes mecanismos de armazenamento para partições ou subpartições na mesma tabela gera o erro ERROR 1469 (HY000): A mistura de manipuladores nas partições não é permitida nesta versão do MySQL.

  - `COMMENT`

    Uma cláusula opcional `COMMENT` pode ser usada para especificar uma string que descreve a partição. Exemplo:

    ```
    COMMENT = 'Data for the years previous to 1999'
    ```

    O comprimento máximo de um comentário de partição é de 1024 caracteres.

  - `DATA DIRECTORY` e `INDEX DIRECTORY`

    `DATA DIRECTORY` e `INDEX DIRECTORY` podem ser usados para indicar o diretório onde, respectivamente, os dados e os índices para esta partição devem ser armazenados. Tanto o `data_dir` quanto o `index_dir` devem ser nomes de caminho absoluto do sistema.

    A partir do MySQL 8.0.21, o diretório especificado em uma cláusula `DATA DIRECTORY` deve ser conhecido por `InnoDB`. Para mais informações, consulte o uso da cláusula DATA DIRECTORY.

    Você deve ter o privilégio `FILE` para usar a opção de partição `DATA DIRECTORY` ou `INDEX DIRECTORY`.

    Exemplo:

    ```
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
    ```

    `DATA DIRECTORY` e `INDEX DIRECTORY` se comportam da mesma maneira que na cláusula `table_option` da instrução `CREATE TABLE`, como usado para tabelas `MyISAM`.

    Um diretório de dados e um diretório de índice podem ser especificados por partição. Se não forem especificados, os dados e índices são armazenados, por padrão, no diretório do banco de dados da tabela.

    As opções `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas ao criar tabelas particionadas se `NO_DIR_IN_CREATE` estiver em vigor.

  - `MAX_ROWS` e `MIN_ROWS`

    Podem ser usadas para especificar, respectivamente, o número máximo e mínimo de linhas a serem armazenadas na partição. Os valores para `max_number_of_rows` e `min_number_of_rows` devem ser inteiros positivos. Assim como as opções de nível de tabela com os mesmos nomes, essas atuam apenas como “sugestões” para o servidor e não são limites rígidos.

  - `TABLESPACE`

    Pode ser usado para designar um espaço de tabela `InnoDB` por arquivo para a partição, especificando `` TABLESPACE `innodb_file_per_table` ``. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento.

    A colocação de partições de tabelas `InnoDB` em espaços de tabelas `InnoDB` compartilhados não é suportada. Os espaços de tabelas compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabelas gerais.

- `subpartition_definition`

  A definição de partição pode opcionalmente conter uma ou mais cláusulas `subpartition_definition`. Cada uma delas consiste, no mínimo, no `SUBPARTITION name`, onde `name` é um identificador para a subpartição. Exceto pela substituição da palavra-chave `PARTITION` pela `SUBPARTITION`, a sintaxe para uma definição de subpartição é idêntica à de uma definição de partição.

  A subpartição deve ser feita por `HASH` ou `KEY`, e só pode ser feita em partições `RANGE` ou `LIST`. Veja a Seção 26.2.6, “Subpartição”.

**Divisão por Colunas Geradas**

A partição por colunas geradas é permitida. Por exemplo:

```
CREATE TABLE t1 (
  s1 INT,
  s2 INT AS (EXP(s1)) STORED
)
PARTITION BY LIST (s2) (
  PARTITION p1 VALUES IN (1)
);
```

A partição considera uma coluna gerada como uma coluna regular, o que permite contornar as limitações em funções que não são permitidas para partição (consulte a Seção 26.6.3, “Limitações de Partição Relativas a Funções”). O exemplo anterior demonstra essa técnica: `EXP()` não pode ser usado diretamente na cláusula `PARTITION BY`, mas uma coluna gerada definida usando `EXP()` é permitida.
