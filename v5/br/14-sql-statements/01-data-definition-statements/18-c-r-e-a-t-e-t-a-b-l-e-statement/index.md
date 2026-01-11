### 13.1.18 Declaração CREATE TABLE

13.1.18.1 Arquivos criados por CREATE TABLE

13.1.18.2 Declaração de Criação de Tabela Temporária

13.1.18.3 Comando CREATE TABLE ... LIKE

13.1.18.4 CREATE TABLE ... SELECT Statement

13.1.18.5 Restrições de Chaves Estrangeiras

13.1.18.6 Alterações na Especificação da Coluna Silenciosa

13.1.18.7 Criar uma tabela e colunas geradas

13.1.18.8 Índices Secundários e Colunas Geradas

13.1.18.9 Configuração das Opções de Comentário do NDB

```sql
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
  | [CONSTRAINT [symbol PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | CHECK (expr)
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT default_value]
      [AUTO_INCREMENT] [UNIQUE [KEY PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [UNIQUE [KEY PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
}

data_type:
    (see Chapter 11, Data Types)

key_part:
    col_name [(length)] [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

table_options:
    table_option ,] table_option] ...

table_option: {
    AUTO_INCREMENT [=] value
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
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
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
        STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]
        [(subpartition_definition [, subpartition_definition] ...)]

subpartition_definition:
    SUBPARTITION logical_name
        STORAGE] ENGINE [=] engine_name]
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

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam as tabelas. Os motores de armazenamento individuais podem impor restrições específicas ao motor. O `InnoDB` permite até 4 bilhões de tabelas.

Para obter informações sobre a representação física de uma tabela, consulte Seção 13.1.18.1, “Arquivos criados por CREATE TABLE”.

Há vários aspectos da instrução `CREATE TABLE`, descritos nos tópicos a seguir nesta seção:

- Nome da tabela
- Tabelas Temporárias
- Clonagem e cópia de tabelas
- Tipos e atributos de dados de colunas
- Índices e Chaves Estrangeiras
- Opções de tabela
- Divisão de tabelas

#### Nome da tabela

- `tbl_name`

  O nome da tabela pode ser especificado como *`db_name.tbl_name`* para criar a tabela em um banco de dados específico. Isso funciona independentemente de existir um banco de dados padrão, assumindo que o banco de dados exista. Se você usar identificadores com aspas, aspas aspas os nomes do banco de dados e da tabela separadamente. Por exemplo, escreva ``mydb`.`mytbl``, não `mydb.mytbl`.

  As regras para nomes de tabelas permitidos estão descritas em Seção 9.2, "Nomes de Objetos do Schema".

- `SE NÃO EXISTIR`

  Previne ocorrência de um erro se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica à indicada pela instrução `CREATE TABLE`.

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é eliminada automaticamente quando a sessão é fechada. Para mais informações, consulte Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”.

#### Clonagem e cópia de tabela

- `LIKE`

  Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

  ```sql
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

  Para obter mais informações, consulte Seção 13.1.18.3, “Instrução CREATE TABLE ... LIKE”.

- `[AS] expressão_de_consulta`

  Para criar uma tabela a partir de outra, adicione uma instrução `SELECT` no final da instrução `CREATE TABLE`:

  ```sql
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

  Para mais informações, consulte Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”.

- `IGNORAR | SUBSTITUIR`

  As opções `IGNORE` e `REPLACE` indicam como lidar com linhas que duplicam valores de chave única ao copiar uma tabela usando uma instrução `[SELECT]` (select.html).

  Para mais informações, consulte Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”.

#### Tipos de dados de colunas e atributos

Há um limite máximo de 4096 colunas por tabela, mas o limite efetivo pode ser menor para uma tabela específica e depende dos fatores discutidos na Seção 8.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho de Linha”.

- `data_type`

  *`data_type`* representa o tipo de dados em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de coluna, bem como informações sobre as propriedades de cada tipo, consulte [Capítulo 11, *Tipos de Dados*] (data-types.html).

  - Alguns atributos não se aplicam a todos os tipos de dados. `AUTO_INCREMENT` só se aplica aos tipos inteiro e ponto flutuante. `DEFAULT` não se aplica aos tipos `BLOB`, `TEXT`, `GEOMETRY` e `JSON`.

  - Os tipos de dados de caracteres (`CHAR`, `VARCHAR`, os tipos `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo de `CHARACTER SET`. Uma collation para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para obter detalhes, consulte Capítulo 10, *Sets de caracteres, Colagens, Unicode*. Exemplo:

    ```sql
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin);
    ```

    O MySQL 5.7 interpreta as especificações de comprimento nas definições de colunas de caracteres em caracteres. Os comprimentos para `BINARY` e `VARBINARY` são em bytes.

  - Para as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`, podem ser criados índices que usam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice. As colunas `BLOB` e `TEXT` também podem ser indexadas, mas um comprimento de prefixo *deve* ser fornecido. Os comprimentos de prefixo são fornecidos em caracteres para tipos de strings não binários e em bytes para tipos de strings binárias. Ou seja, as entradas do índice consistem nos primeiros *`length`* caracteres de cada valor da coluna para as colunas `CHAR`, `VARCHAR` e `TEXT`, e nos primeiros *`length`* bytes de cada valor da coluna para as colunas `BINARY`, `VARBINARY` e `BLOB`. Indexar apenas um prefixo dos valores da coluna dessa forma pode tornar o arquivo de índice muito menor. Para obter informações adicionais sobre prefixos de índice, consulte Seção 13.1.14, “Instrução CREATE INDEX”.

    Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam a indexação em colunas `BLOB` e `TEXT`. Por exemplo:

    ```sql
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

    A partir do MySQL 5.7.17, se um prefixo de índice especificado exceder o tamanho máximo do tipo de dado da coluna, o `CREATE TABLE` trata o índice da seguinte forma:

    - Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver ativado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dado da coluna e uma mensagem de aviso é exibida (se o modo SQL rigoroso não estiver ativado).

    - Para um índice único, um erro ocorre independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

  - As colunas `JSON` (json.html) não podem ser indexadas. Você pode contornar essa restrição criando um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Veja Criando um índice de coluna gerada para fornecer um índice de coluna JSON para um exemplo detalhado.

- `NOT NULL | NULL`

  Se não for especificado `NULL` nem `NOT NULL`, a coluna será tratada como se o `NULL` tivesse sido especificado.

  No MySQL 5.7, apenas os motores de armazenamento `InnoDB`, `MyISAM` e `MEMORY` suportam índices em colunas que podem ter valores `NULL`. Em outros casos, você deve declarar as colunas indexadas como `NOT NULL` ou ocorrerá um erro.

- `PADrão`

  Especifica um valor padrão para uma coluna. Para obter mais informações sobre o tratamento de valores padrão, incluindo o caso em que uma definição de coluna não inclui um valor `DEFAULT` explícito, consulte Seção 11.6, "Valores padrão de tipo de dados".

  Se o modo SQL `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE` estiver habilitado e um valor padrão com data não estiver correto de acordo com esse modo, o `CREATE TABLE` gera um aviso se o modo SQL rigoroso não estiver habilitado e um erro se o modo rigoroso estiver habilitado. Por exemplo, com o `NO_ZERO_IN_DATE` habilitado, `c1 DATE DEFAULT '2010-00-00'` gera um aviso.

- `AUTO_INCREMENT`

  Uma coluna de número inteiro ou de ponto flutuante pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor de `NULL` (recomendado) ou `0` em uma coluna `AUTO_INCREMENT` indexada, a coluna é definida para o próximo valor da sequência. Normalmente, isso é `valor + 1`, onde *`valor`* é o maior valor para a coluna atualmente na tabela. As sequências `AUTO_INCREMENT` começam com `1`.

  Para recuperar um valor `AUTO_INCREMENT` após inserir uma linha, use a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Veja Seção 12.15, “Funções de Informação” e mysql_insert_id().

  Se o modo SQL `NO_AUTO_VALUE_ON_ZERO` estiver habilitado, você pode armazenar `0` em colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor da sequência. Veja Seção 5.1.10, “Modos SQL do Servidor”.

  Só pode haver uma coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver apenas valores positivos. Inserir um número negativo é considerado como inserir um número positivo muito grande. Isso é feito para evitar problemas de precisão quando os números "voltam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

  Para tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Veja Seção 3.6.9, “Usando AUTO_INCREMENT”.

  Para tornar o MySQL compatível com algumas aplicações ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última linha inserida com a seguinte consulta:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Esse método exige que a variável `sql_auto_is_null` não esteja definida como 0. Consulte Seção 5.1.7, "Variáveis do Sistema do Servidor".

  Para obter informações sobre `InnoDB` e `AUTO_INCREMENT`, consulte Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”. Para obter informações sobre `AUTO_INCREMENT` e a Replicação do MySQL, consulte Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”.

- `COMENTÁRIO`

  Um comentário para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres. O comentário é exibido pelas instruções `SHOW CREATE TABLE` e `SHOW FULL COLUMNS`. Ele também é exibido na coluna `COLUMN_COMMENT` da tabela `COLUMNS` do Schema de Informações `COLUMNS`.

- `COLUMN_FORMAT`

  No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais de tabelas de `NDB` usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar armazenamento de largura fixa, `DYNAMIC` permite que a coluna tenha largura variável e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável, conforme determinado pelo tipo de dados da coluna (possivelmente sobrescrito por um especificador `ROW_FORMAT`).

  A partir do MySQL NDB Cluster 7.5.4, para as tabelas `[NDB]` (mysql-cluster.html), o valor padrão para `COLUMN_FORMAT` é `FIXED`. (O valor padrão havia sido alterado para `DYNAMIC` no MySQL NDB Cluster 7.5.1, mas essa alteração foi revertida para manter a compatibilidade reversa com as séries de lançamentos GA existentes.) (Bug #24487363)

  No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para obter mais informações e possíveis soluções, consulte Seção 21.2.7.5, “Limites associados a objetos de banco de dados no NDB Cluster”.

  `COLUMN_FORMAT` atualmente não tem efeito sobre as colunas de tabelas que utilizam motores de armazenamento diferentes de `NDB`. No MySQL 5.7 e versões posteriores, `COLUMN_FORMAT` é ignorado silenciosamente.

- `Armazenamento`

  Para as tabelas de `NDB`, é possível especificar se a coluna será armazenada no disco ou na memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada no disco e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. A instrução `CREATE TABLE` usada ainda deve incluir uma cláusula `TABLESPACE`:

  ```sql
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

  Para tabelas de `NDB`, `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

  A cláusula `STORAGE` não tem efeito em tabelas que utilizam outros motores de armazenamento além do `NDB`. A palavra-chave `STORAGE` é suportada apenas na versão do **mysqld** que vem com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

- `GERADO SEMPRE`

  Usado para especificar uma expressão de coluna gerada. Para obter informações sobre colunas geradas, consulte Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

  As colunas geradas armazenadas (glossary.html#glos_stored_generated_column) podem ser indexadas. O `InnoDB` suporta índices secundários em colunas geradas virtuais (glossary.html#glos_virtual_generated_column). Veja Seção 13.1.18.8, “Indekses Secundários e Colunas Geradas”.

#### Índices e Chaves Estrangeiras

Várias palavras-chave se aplicam à criação de índices e chaves estrangeiras. Para informações gerais, além das descrições a seguir, consulte Seção 13.1.14, “Instrução CREATE INDEX” e Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

- Símbolo `CONSTRAINT`

  A cláusula do símbolo `CONSTRAINT` pode ser usada para nomear uma restrição. Se a cláusula não for fornecida ou se um *símbolo* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição, com a exceção mencionada abaixo. O valor do *símbolo*, se usado, deve ser único por esquema (banco de dados), por tipo de restrição. Um *símbolo* duplicado resulta em um erro. Veja também a discussão sobre os limites de comprimento dos identificadores de restrições gerados em Seção 9.2.1, “Limites de comprimento de identificadores”.

  Nota

  Se a cláusula `CONSTRAINT símbolo` não for fornecida em uma definição de chave estrangeira, ou se um `*símbolo*` não for incluído após a palavra-chave `CONSTRAINT`, o `NDB` usa o nome do índice da chave estrangeira.

  O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema.

- `CHAVE PRIMÁRIA`

  Um índice único onde todas as colunas principais devem ser definidas como `NOT NULL`. Se elas não forem declaradas explicitamente como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas um `PRIMARY KEY`. O nome de um `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como o nome para qualquer outro tipo de índice.

  Se você não tiver um `PRIMARY KEY` e um aplicativo solicitar o `PRIMARY KEY` em suas tabelas, o MySQL retornará o primeiro `UNIQUE` índice que não tenha colunas `NULL` como `PRIMARY KEY`.

  Nas tabelas `InnoDB`, mantenha o `PRIMARY KEY` curto para minimizar o overhead de armazenamento para índices secundários. Cada entrada de índice secundário contém uma cópia das colunas da chave primária da linha correspondente. (Veja Seção 14.6.2.1, “Índices Clustered e Secundários”.)

  Na tabela criada, o `PRIMARY KEY` é colocado primeiro, seguido de todos os índices `UNIQUE`, e depois os índices não únicos. Isso ajuda o otimizador do MySQL a priorizar qual índice usar e também a detectar mais rapidamente chaves `UNIQUE` duplicadas.

  Um `PRIMARY KEY` pode ser um índice de múltiplas colunas. No entanto, você não pode criar um índice de múltiplas colunas usando o atributo `PRIMARY KEY` na especificação de uma coluna. Isso apenas marca essa única coluna como primária. Você deve usar uma cláusula `PRIMARY KEY(key_part, ...)` separada.

  Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

  No MySQL, o nome de uma chave primária é `PRIMARY`. Para outros índices, se você não atribuir um nome, o índice receberá o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo único. Você pode ver os nomes dos índices de uma tabela usando `SHOW INDEX FROM tbl_name`. Veja Seção 13.7.5.22, “Instrução SHOW INDEX”.

- `CHAVE | ÍNDICE`

  `KEY` é normalmente um sinônimo de `INDEX`. O atributo `PRIMARY KEY` também pode ser especificado como apenas `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros sistemas de banco de dados.

- `ÚNICO`

  Um índice `UNIQUE` cria uma restrição de forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Para todos os motores, um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor de prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo.

  Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, conforme descrito em Índices Únicos.

- `FULLTEXT`

  Um índice `FULLTEXT` é um tipo especial de índice usado para pesquisas de texto completo. Apenas os motores de armazenamento `[InnoDB]` e `[MyISAM]` (innodb-storage-engine.html) e `[MyISAM]` (myisam-storage-engine.html) suportam índices `FULLTEXT`. Eles podem ser criados apenas a partir de colunas `[CHAR]` (char.html), `[VARCHAR]` (char.html) e `[TEXT]` (blob.html). A indexação sempre ocorre sobre toda a coluna; a indexação com prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte Seção 12.9, “Funções de Busca de Texto Completo” para obter detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um valor de *`index_option`* para associar um plugin de analisador ao índice se as operações de indexação e busca de texto completo precisarem de tratamento especial. Esta cláusula é válida apenas para índices `FULLTEXT`. Tanto o `[InnoDB]` (innodb-storage-engine.html) quanto o `[MyISAM]` (myisam-storage-engine.html) suportam plugins de analisadores de texto completo. Consulte Plugins de Analisador de Texto Completo e Escrevendo Plugins de Analisador de Texto Completo para obter mais informações.

- `ESPACIAL`

  Você pode criar índices `SPATIAL` em tipos de dados espaciais. Os tipos espaciais são suportados apenas para tabelas `MyISAM` e `InnoDB`, e as colunas indexadas devem ser declaradas como `NOT NULL`. Veja Seção 11.4, “Tipos de Dados Espaciais”.

- `FOREIGN KEY`

  O MySQL suporta chaves estrangeiras, que permitem cruzar dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter esses dados dispersos consistentes. Para informações sobre definição e opções, consulte *`reference_definition`* e *`reference_option`*.

  As tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Consulte Seção 22.6, “Restrições e Limitações de Particionamento” para obter mais informações.

- `VER`

  A cláusula `CHECK` é analisada, mas ignorada por todos os mecanismos de armazenamento.

- `chave_parte`

  - Uma especificação de `key_part` pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões para especificar o armazenamento de valores de índice ascendentes ou descendentes. Atualmente, elas são analisadas, mas ignoradas; os valores de índice são sempre armazenados em ordem ascendente.

  - Os prefixos, definidos pelo atributo *`length`*, podem ter até 767 bytes para tabelas `InnoDB` ou 3072 bytes se a opção `innodb_large_prefix` estiver habilitada. Para tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes.

    Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

- `index_type`

  Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING nome_do_tipo`.

  Exemplo:

  ```sql
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
  ```

  A posição preferida para `USING` está após a lista de colunas de índice. Pode ser dada antes da lista de colunas, mas o suporte para o uso da opção nessa posição está desatualizado; espere que ela seja removida em uma futura versão do MySQL.

- `index_option`

  Os valores de *`index_option`* especificam opções adicionais para um índice.

  - `KEY_BLOCK_SIZE`

    Para as tabelas `[MyISAM]` (myisam-storage-engine.html), o `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave do índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor de `KEY_BLOCK_SIZE` do nível da tabela.

    Para obter informações sobre o atributo `KEY_BLOCK_SIZE` de nível de tabela, consulte Opções de tabela.

  - COM O PARSER

    A opção `WITH PARSER` só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de processamento de texto ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. Tanto o `InnoDB` quanto o `MyISAM` suportam plugins de processamento de texto completo. Se você tiver uma tabela `[MyISAM]`]\(myisam-storage-engine.html) com um plugin de processador de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

  - `COMENTÁRIO`

    As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

    Você pode definir o valor `MERGE_THRESHOLD` do `InnoDB` para um índice individual usando a cláusula `COMMENT` da opção `index_option`. Veja Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índices”.

  Para obter mais informações sobre os valores permitidos do *`index_option`*, consulte Seção 13.1.14, “Instrução CREATE INDEX”. Para obter mais informações sobre índices, consulte Seção 8.3.1, “Como o MySQL usa índices”.

- `definição_referência`

  Para detalhes e exemplos da sintaxe de *`reference_definition`*, consulte Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

  As tabelas `InnoDB` (innodb-storage-engine.html) e `NDB` (mysql-cluster.html) suportam a verificação de restrições de chave estrangeira. As colunas da tabela referenciada devem sempre ser nomeadas explicitamente. As ações `ON DELETE` e `ON UPDATE` em chaves estrangeiras são suportadas. Para informações e exemplos mais detalhados, consulte Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

  Para outros motores de armazenamento, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas instruções de `CREATE TABLE` (create-table.html).

  Importante

  Para usuários familiarizados com o padrão ANSI/ISO SQL, observe que nenhum mecanismo de armazenamento, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada nas definições de restrições de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, o uso de `MATCH` deve ser evitado.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com múltiplos colunas) são tratados ao serem comparados com uma chave primária. O `InnoDB` implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja `NULL` total ou parcialmente. Nesse caso, a linha da tabela (filha) que contém essa chave estrangeira é permitida para ser inserida e não corresponde a nenhuma linha na tabela referenciada (pai). É possível implementar outras semânticas usando gatilhos.

  Além disso, o MySQL exige que as colunas referenciadas estejam indexadas para garantir o desempenho. No entanto, o `InnoDB` não exige que as colunas referenciadas sejam declaradas como `UNIQUE` ou `NOT NULL`. O tratamento de referências de chaves estrangeiras a chaves não únicas ou chaves que contêm valores `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. É recomendável usar chaves estrangeiras que referenciam apenas chaves que sejam `UNIQUE` (ou `PRIMARY`) e `NOT NULL`.

  O MySQL analisa, mas ignora as especificações `inline `REFERENCES`(conforme definido no padrão SQL) quando as referências são definidas como parte da especificação da coluna. O MySQL aceita cláusulas`REFERENCES`apenas quando especificadas como parte de uma especificação separada de`FOREIGN KEY\`. Para mais informações, consulte Seção 1.6.2.3, “Diferenças na restrição FOREIGN KEY”.

- `opção_referência`

  Para obter informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

#### Opções da tabela

As opções da tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os motores de armazenamento, a menos que indicado de outra forma. Opções que não se aplicam a um determinado motor de armazenamento podem ser aceitas e lembradas como parte da definição da tabela. Essas opções então se aplicam se você usar `ALTER TABLE` (alter-table.html) posteriormente para converter a tabela para usar um motor de armazenamento diferente.

- `MOTOR`

  Especifica o mecanismo de armazenamento para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do mecanismo pode ser não citado ou citado. O nome citado `'DEFAULT'` é reconhecido, mas ignorado.

  <table summary="Nomes dos motores de armazenamento permitidos para a opção de tabela ENGINE e uma descrição de cada motor."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Motor de Armazenamento</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>MERGE</code>]</td> <td>Tabelas seguras para transações com bloqueio de linhas e chaves estrangeiras. O mecanismo de armazenamento padrão para novas tabelas. VejaCapítulo 14,<i>O Motor de Armazenamento InnoDB</i>, e em particularSeção 14.1, “Introdução ao InnoDB”se você tem experiência com MySQL, mas é novo em PH_HTML_CODE_<code>MERGE</code>].</td> </tr><tr> <td>PH_HTML_CODE_<code>MRG_MyISAM</code>]</td> <td>O motor de armazenamento portátil binário que é usado principalmente para cargas de trabalho de leitura apenas ou quase exclusivamente de leitura. VejaSeção 15.2, “O Motor de Armazenamento MyISAM”.</td> </tr><tr> <td>PH_HTML_CODE_<code>NDB</code>]</td> <td>Os dados deste mecanismo de armazenamento são armazenados apenas na memória. VejaSeção 15.3, “O Motor de Armazenamento de MEMÓRIA”.</td> </tr><tr> <td>PH_HTML_CODE_<code>NDBCLUSTER</code>]</td> <td>Tabelas que armazenam linhas no formato de valores separados por vírgula. VejaSeção 15.4, “O Motor de Armazenamento CSV”.</td> </tr><tr> <td><code>ARCHIVE</code></td> <td>O mecanismo de armazenamento de arquivamento. VejaSeção 15.5, “O Motor de Armazenamento ARCHIVE”.</td> </tr><tr> <td><code>EXAMPLE</code></td> <td>Um exemplo de motor. VejaSeção 15.9, “O Motor de Armazenamento EXAMPLE”.</td> </tr><tr> <td><code>FEDERATED</code></td> <td>Motor de armazenamento que acessa tabelas remotas. VejaSeção 15.8, “O Motor de Armazenamento FEDERATED”.</td> </tr><tr> <td><code>HEAP</code></td> <td>Este é um sinônimo de <code>MEMORY</code>.</td> </tr><tr> <td><code>MERGE</code></td> <td>Uma coleção de tabelas <code>InnoDB</code><code>MERGE</code>] usadas como uma única tabela. Também conhecida como <code>MRG_MyISAM</code>. VejaSeção 15.7, “O Motor de Armazenamento MERGE”.</td> </tr><tr> <td><code>NDB</code></td> <td>Tabelas baseadas em memória, distribuídas, tolerantes a falhas e que suportam transações e chaves estrangeiras. Também conhecidas como<code>NDBCLUSTER</code>VejaCapítulo 21,<i>MySQL NDB Cluster 7.5 e NDB Cluster 7.6</i>.</td> </tr></tbody></table>

  Por padrão, se um mecanismo de armazenamento for especificado que não está disponível, a instrução falha com um erro. Você pode sobrepor esse comportamento removendo `NO_ENGINE_SUBSTITUTION` do modo SQL do servidor (consulte Seção 5.1.10, “Modos SQL do Servidor”) para que o MySQL permita a substituição do mecanismo especificado pelo mecanismo de armazenamento padrão, em vez disso. Normalmente, nesse caso, é o `InnoDB`, que é o valor padrão para a variável de sistema `default_storage_engine`. Quando `NO_ENGINE_SUBSTITUTION` é desativado, um aviso ocorre se a especificação do mecanismo de armazenamento não for atendida.

- `AUTO_INCREMENT`

  O valor `AUTO_INCREMENT` inicial para a tabela. No MySQL 5.7, isso funciona para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor de autoincremento para motores que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma linha "falsa" com um valor menor que o desejado após a criação da tabela e, em seguida, exclua a linha falsa.

  Para motores que suportam a opção `AUTO_INCREMENT` na opção `CREATE TABLE` (create-table.html), você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor `AUTO_INCREMENT`. O valor não pode ser definido como menor que o valor máximo atualmente na coluna.

- `AVG_ROW_LENGTH`

  Uma aproximação da duração média da linha da sua tabela. Você precisa definir isso apenas para tabelas grandes com linhas de tamanho variável.

  Quando você cria uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir o tamanho da tabela resultante. Se você não especificar nenhuma dessas opções, o tamanho máximo dos arquivos de dados e de índice `MyISAM` é de 256TB por padrão. (Se o seu sistema operacional não suportar arquivos tão grandes, os tamanhos das tabelas são limitados pelo limite de tamanho do arquivo.) Se você deseja manter os tamanhos dos ponteiros pequenos para tornar o índice menor e mais rápido e não precisa realmente de arquivos grandes, você pode diminuir o tamanho padrão do ponteiro configurando a variável de sistema `myisam_data_pointer_size`. (Veja Seção 5.1.7, “Variáveis de Sistema do Servidor”.) Se você deseja que todas as suas tabelas possam crescer acima do limite padrão e está disposto a ter suas tabelas um pouco mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro configurando essa variável. Definir o valor para 7 permite tamanhos de tabela de até 65.536TB.

- `[SET DE CARACTERES PREDEFINIDO]`

  Especifica um conjunto de caracteres padrão para a tabela. `CHARSET` é sinônimo de `CHARACTER SET`. Se o nome do conjunto de caracteres for `DEFAULT`, o conjunto de caracteres do banco de dados será usado.

- `CHECKSUM`

  Defina este valor para 1 se quiser que o MySQL mantenha um checksum em tempo real para todas as linhas (ou seja, um checksum que o MySQL atualiza automaticamente à medida que a tabela muda). Isso torna a tabela um pouco mais lenta para atualização, mas também facilita a localização de tabelas corrompidas. A instrução `CHECKSUM TABLE` relata o checksum. (`MyISAM` apenas.)

- `[DEFAULT] COLLATE`

  Especifica uma ordenação padrão para a tabela.

- `COMENTÁRIO`

  Um comentário para a tabela, com até 2048 caracteres.

  Você pode definir o valor `MERGE_THRESHOLD` de `InnoDB` para uma tabela usando a cláusula `COMMENT` da opção `table_option`. Veja Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índices”.

  **Definindo as opções NDB_TABLE.**

  No MySQL NDB Cluster 7.5.2 e versões posteriores, o comentário da tabela em uma instrução `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar um a quatro das opções `NDB_TABLE` `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED` como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a string `NDB_TABLE=` que inicia o texto do comentário citado. Um exemplo de instrução usando essa sintaxe é mostrado aqui (texto em destaque):

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

  Espaços não são permitidos dentro da string entre aspas. A string é case-insensitive.

  O comentário é exibido como parte do resultado do `SHOW CREATE TABLE`. O texto do comentário também está disponível como a coluna `TABLE_COMMENT` da tabela do Esquema de Informações do MySQL `TABLES`.

  Essa sintaxe de comentário também é suportada com as instruções `ALTER TABLE` para tabelas `NDB`. Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter tido anteriormente.

  A opção `MERGE_THRESHOLD` nos comentários da tabela não é suportada para tabelas de `NDB` (é ignorada).

  Para obter informações completas sobre sintaxe e exemplos, consulte Seção 13.1.18.9, “Definindo opções de comentário NDB”.

- COMPRESSÃO

  O algoritmo de compressão usado para compressão de nível de página para tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com o recurso de compressão transparente de página. A compressão de página só é suportada em tabelas `InnoDB` que residem em espaços de tabelas file-per-table e está disponível apenas em plataformas Linux e Windows que suportam arquivos esparsos e perfuração de buracos. Para mais informações, consulte Seção 14.9.2, “Compressão de Página InnoDB”.

- `CONEXÃO`

  A cadeia de conexão para uma tabela `FEDERATED`.

  Nota

  Versões mais antigas do MySQL usavam uma opção `COMMENT` para a string de conexão.

- `DÍARREIO DE DADOS`, `DÍARREIO DE ÍNDICES`

  Para o `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite criar uma tabela fora do diretório de dados. A variável `innodb_file_per_table` deve estar habilitada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado. Para mais informações, consulte Seção 14.6.1.2, “Criando tabelas externamente”.

  Ao criar tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de índice de uma tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondem ao nome do banco de dados ao criar uma tabela `MyISAM` com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

  A partir do MySQL 5.7.17, você deve ter o privilégio `FILE` para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

  Importante

  As opções de diretório de dados e diretório de índice de nível de tabela são ignoradas para tabelas particionadas. (Bug #32091)

  Essas opções funcionam apenas quando você não estiver usando a opção `--skip-symbolic-links` (server-options.html#option_mysqld_symbolic-links). Seu sistema operacional também deve ter uma chamada `realpath()` segura e compatível com threads. Consulte Seção 8.12.3.2, “Usando Links Simbólicos para Tabelas MyISAM no Unix” para obter informações mais completas.

  Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se o `MyISAM` encontrar um arquivo `.MYD` existente nesse caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção `--keep_files_on_create`, caso em que o `MyISAM` não sobrescreverá os arquivos existentes e retornará um erro.

  Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, o MyISAM sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

  Importante

  Você não pode usar nomes de caminho que contenham o diretório de dados MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e particionamentos individuais de tabelas. (Veja o bug #32167.)

- `DELAY_KEY_WRITE`

  Defina esse valor para 1 se quiser adiar as atualizações de chave da tabela até que a tabela seja fechada. Consulte a descrição da variável de sistema `delay_key_write` na Seção 5.1.7, “Variáveis de Sistema do Servidor”. (`MyISAM` apenas.)

- Criptografia

  Defina a opção `ENCRYPTION` para `'Y'` para habilitar a criptografia de dados em nível de página para uma tabela `InnoDB` criada em um espaço de tabelas file-per-table. Os valores das opções não são case-sensitive. A opção `ENCRYPTION` foi introduzida com o recurso de criptografia de espaço de tabelas `InnoDB`; veja Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”. Um plugin `keyring` deve ser instalado e configurado antes que a criptografia possa ser habilitada.

  A opção `ENCRYPTION` é suportada apenas pelo mecanismo de armazenamento `InnoDB`; portanto, ela só funciona se o mecanismo de armazenamento padrão for `InnoDB`, ou se a instrução `CREATE TABLE` especificar também `ENGINE=InnoDB`. Caso contrário, a instrução será rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

- `INSERT_METHOD`

  Se você deseja inserir dados em uma tabela `MERGE`, deve especificar com `INSERT_METHOD` a tabela na qual a linha deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use o valor `FIRST` ou `LAST` para que as inserções sejam feitas na primeira ou última tabela, ou o valor `NO` para impedir as inserções. Veja Seção 15.7, “O Motor de Armazenamento MERGE”.

- `KEY_BLOCK_SIZE`

  Para as tabelas `[MyISAM]` (myisam-storage-engine.html), o `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave do índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor de `KEY_BLOCK_SIZE` do nível da tabela.

  Para as tabelas de `InnoDB` (innodb-storage-engine.html), o valor `KEY_BLOCK_SIZE` especifica o tamanho da página em kilobytes a ser usado para as tabelas `InnoDB` comprimidos. O valor `KEY_BLOCK_SIZE` é tratado como um indicativo; o `InnoDB` pode usar um tamanho diferente, se necessário. O valor `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor de `innodb_page_size` (innodb-parameters.html#sysvar_innodb_page_size). Um valor de 0 representa o tamanho de página comprimida padrão, que é metade do valor de `innodb_page_size` (innodb-parameters.html#sysvar_innodb_page_size). Dependendo de `innodb_page_size` (innodb-parameters.html#sysvar_innodb_page_size), os possíveis valores de `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Consulte Seção 14.9.1, “Compressão de Tabelas InnoDB” para obter mais informações.

  A Oracle recomenda a ativação de `innodb_strict_mode` ao especificar `KEY_BLOCK_SIZE` para tabelas `InnoDB`. Quando o `innodb_strict_mode` está ativado, especificar um valor inválido para `KEY_BLOCK_SIZE` retorna um erro. Se o `innodb_strict_mode` estiver desativado, um valor inválido para `KEY_BLOCK_SIZE` resulta em um aviso, e a opção `KEY_BLOCK_SIZE` é ignorada.

  A coluna `Create_options` na resposta de `SHOW TABLE STATUS` (show-table-status.html) relata a opção `KEY_BLOCK_SIZE` especificada originalmente, assim como a consulta `SHOW CREATE TABLE` (show-create-table.html).

  O `InnoDB` só suporta `KEY_BLOCK_SIZE` no nível da tabela.

  O `KEY_BLOCK_SIZE` não é suportado com os valores de `32KB` e `64KB` de `[innodb_page_size`]\(innodb-parameters.html#sysvar_innodb_page_size). A compressão de tabelas do `InnoDB` não suporta esses tamanhos de páginas.

- `MAX_ROWS`

  O número máximo de linhas que você planeja armazenar na tabela. Esse não é um limite rígido, mas sim um indicativo para o mecanismo de armazenamento de que a tabela deve ser capaz de armazenar pelo menos esse número de linhas.

  Importante

  O uso de `MAX_ROWS` com tabelas `NDB` para controlar o número de partições da tabela é desaconselhável a partir do NDB Cluster 7.5.4. Ele ainda é suportado em versões posteriores para compatibilidade com versões anteriores, mas está sujeito à remoção em uma futura versão. Use PARTITION_BALANCE; veja Definindo opções de NDB_TABLE.

  O mecanismo de armazenamento `NDB` trata esse valor como um máximo. Se você planeja criar tabelas do NDB Cluster muito grandes (contendo milhões de linhas), você deve usar essa opção para garantir que o `NDB` aloque um número suficiente de slots de índice na tabela hash usada para armazenar hashes das chaves primárias da tabela, definindo `MAX_ROWS = 2 * rows`, onde *`rows`* é o número de linhas que você espera inserir na tabela.

  O valor máximo de `MAX_ROWS` é 4294967295; valores maiores são truncados para esse limite.

- `MIN_ROWS`

  O número mínimo de linhas que você planeja armazenar na tabela. O mecanismo de armazenamento `MEMORY` usa essa opção como uma dica sobre o uso de memória.

- `PACK_KEYS`

  É eficaz apenas com tabelas `MyISAM`. Defina esta opção para 1 se quiser ter índices menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção para 0 desabilita todo o empilhamento de chaves. Definir para `DEFAULT` indica ao motor de armazenamento que ele deve empilhar apenas colunas longas de `CHAR` (`CHAR.html`), `VARCHAR` (`VARCHAR.html`), `BINARY` (`BINARY-VARBINARY.html`) ou `VARBINARY` (`VARBINARY.html`).

  Se você não usar `PACK_KEYS`, o padrão é embalar strings, mas não números. Se você usar `PACK_KEYS=1`, os números também serão embalados.

  Ao embalar chaves de números binários, o MySQL usa compressão de prefixo:

  - Cada chave precisa de um byte extra para indicar quantos bytes da chave anterior são iguais para a próxima chave.

  - O ponteiro para a linha é armazenado em ordem de alto byte primeiro, diretamente após a chave, para melhorar a compressão.

  Isso significa que, se você tiver muitas chaves iguais em duas linhas consecutivas, todas as chaves seguintes geralmente ocupam apenas dois bytes (incluindo o ponteiro para a linha). Compare isso com o caso comum em que as chaves seguintes ocupam `storage_size_for_key + pointer_size` (onde o tamanho do ponteiro geralmente é 4). Por outro lado, você obtém um benefício significativo da compressão prefixada apenas se tiver muitas números iguais. Se todas as chaves forem totalmente diferentes, você usa um byte a mais por chave, se a chave não for uma chave que pode ter valores `NULL` (Neste caso, o comprimento da chave compactada é armazenado no mesmo byte que é usado para marcar se uma chave é `NULL`).

- `SENHA`

  Esta opção não é usada. Se você precisar embaralhar seus arquivos `.frm` e torná-los inutilizáveis para qualquer outro servidor MySQL, entre em contato com nosso departamento de vendas.

- `ROW_FORMAT`

  Define o formato físico em que as linhas são armazenadas.

  Ao criar uma tabela com o modo estrito desativado, o formato de linha padrão do mecanismo de armazenamento é usado se o formato de linha especificado não for suportado. O formato de linha real da tabela é relatado na coluna `Row_format` em resposta a `SHOW TABLE STATUS`. A coluna `Create_options` mostra o formato de linha especificado na instrução `CREATE TABLE`, assim como em `SHOW CREATE TABLE`.

  As opções de formato de linha diferem dependendo do mecanismo de armazenamento usado para a tabela.

  Para tabelas do InnoDB:

  - O formato de linha padrão é definido por `innodb_default_row_format`, que tem um ajuste padrão de `DINÂMICO`. O formato de linha padrão é usado quando a opção `ROW_FORMAT` não é definida ou quando `ROW_FORMAT=DEFAULT` é usada.

    Se a opção `ROW_FORMAT` não for definida ou se `ROW_FORMAT=DEFAULT` for usada, as operações que reconstruem uma tabela também alteram silenciosamente o formato da linha da tabela para o padrão definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato da Linha de uma Tabela.

  - Para um armazenamento mais eficiente dos tipos de dados do `InnoDB`, especialmente dos tipos `BLOB` (blob.html), use o `DYNAMIC`. Consulte Formato de linha dinâmico para obter informações sobre os requisitos associados ao formato de linha `DYNAMIC`.

  - Para habilitar a compressão para as tabelas do `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. Consulte Seção 14.9, “Compressão de Tabelas e Páginas do InnoDB” para obter informações sobre os requisitos associados ao formato de linha `COMPRESSED`.

  - O formato de linha usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o formato de linha `REDUNDANT`.

  - Quando você especificar uma cláusula `ROW_FORMAT` não padrão, considere também habilitar a opção de configuração `innodb_strict_mode`.

  - `ROW_FORMAT=FIXED` não é suportado. Se `ROW_FORMAT=FIXED` for especificado enquanto o modo `innodb_strict_mode` estiver desativado, o `InnoDB` emite uma mensagem de aviso e assume que `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` for especificado enquanto o modo `innodb_strict_mode` estiver ativado, o que é o padrão, o `InnoDB` retorna um erro.

  - Para obter informações adicionais sobre os formatos de linha do InnoDB, consulte Seção 14.11, “Formatos de Linha do InnoDB”.

  Para as tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para formatos de linha estáticos ou de comprimento variável. **myisampack** define o tipo como `COMPRESSED`. Veja Seção 15.2.3, “Formatos de Armazenamento de Tabelas MyISAM”.

  Para as tabelas ``NDB`, o `ROW_FORMAT`padrão no MySQL NDB Cluster 7.5.1 e versões posteriores é`DINÂMICO`. (Anteriormente, era `FIXO\`.)

- `STATS_AUTO_RECALC`

  Especifica se as estatísticas persistentes estatísticas persistentes de uma tabela `InnoDB` devem ser recalculadas automaticamente. O valor `DEFAULT` determina o ajuste das estatísticas persistentes da tabela pela opção de configuração `innodb_stats_auto_recalc`. O valor `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados na tabela forem alterados. O valor `0` impede a recalculação automática para esta tabela; com este ajuste, execute uma declaração `ANALYZE TABLE` para recalcular as estatísticas após fazer alterações substanciais na tabela. Para obter mais informações sobre o recurso de estatísticas persistentes, consulte Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

- `STATS_PERSISTENT`

  Especifica se a estatística persistente deve ser habilitada para uma tabela `InnoDB`. O valor `DEFAULT` determina o ajuste da estatística persistente para a tabela pela opção de configuração `innodb_stats_persistent`. O valor `1` habilita a estatística persistente para a tabela, enquanto o valor `0` desativa essa funcionalidade. Após habilitar a estatística persistente por meio de uma instrução `CREATE TABLE` ou `ALTER TABLE`, execute uma instrução `ANALYZE TABLE`]\(analyze-table.html) para calcular as estatísticas, após carregar dados representativos na tabela. Para obter mais informações sobre a funcionalidade de estatísticas persistentes, consulte Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

- `STATS_SAMPLE_PAGES`

  O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Para mais informações, consulte Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Optimizador Persistente”.

- `TABLESPACE`

  A cláusula `TABLESPACE` pode ser usada para criar uma tabela `InnoDB` em um espaço de tabelas geral existente, um espaço de tabelas por arquivo ou o espaço de tabelas do sistema.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

  O espaço de tabela geral que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para obter informações sobre espaços de tabela gerais, consulte Seção 14.6.3.3, “Espaços de Tabela Geral”.

  O `tablespace_name` é um identificador sensível a maiúsculas e minúsculas. Ele pode ser citado ou não. O caractere barra invertida (“/”) não é permitido. Os nomes que começam com “innodb_” são reservados para uso especial.

  Para criar uma tabela no espaço de tabela do sistema, especifique `innodb_system` como o nome do espaço de tabela.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

  Usando `TABLESPACE [=] innodb_system`, você pode colocar uma tabela de qualquer formato de linha não compactada no espaço de tabelas do sistema, independentemente da configuração de `[innodb_file_per_table]` (innodb-parameters.html#sysvar_innodb_file_per_table). Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao espaço de tabelas do sistema usando `TABLESPACE [=] innodb_system`.

  Para criar uma tabela em um espaço de tabela por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabela.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

  Nota

  Se `innodb_file_per_table` estiver habilitado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um espaço de tabela `InnoDB` por arquivo. As tabelas `InnoDB` são criadas em espaços de tabela por arquivo por padrão quando `innodb_file_per_table` está habilitado.

  Nota

  O suporte para a criação de partições de tabela em espaços de tabelas `InnoDB` compartilhados é descontinuado no MySQL 5.7.24; espere-se que ele seja removido em uma versão futura do MySQL. Os espaços de tabelas compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabelas gerais.

  A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a opção `TABLESPACE`.

  Nota

  O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` foi descontinuado a partir do MySQL 5.7.24; espere-se que ele seja removido em uma versão futura do MySQL.

  A opção `STORAGE` da tabela é usada apenas com tabelas `NDB` (mysql-cluster.html). `STORAGE` determina o tipo de armazenamento utilizado e pode ser `DISK` ou `MEMORY`.

  `TABLESPACE ... STORAGE DISK` atribui uma tabela a um espaço de dados de disco do NDB Cluster. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por `TABLESPACE` *`tablespace_name`*.

  Para `STORAGE MEMORY`, o nome do tablespace é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está na memória.

  Para obter mais informações, consulte Seção 21.6.11, “Tabelas de dados de disco do cluster NDB”.

- `UNIÃO`

  Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma única. Isso funciona apenas com tabelas `MERGE`. Veja Seção 15.7, “O Motor de Armazenamento MERGE”.

  Você deve ter os privilégios `SELECT`, `UPDATE` e `DELETE` nas tabelas que você mapeia para uma tabela `MERGE`.

  Nota

  Anteriormente, todas as tabelas utilizadas tinham que estar no mesmo banco de dados que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Divisão de tabela

*`partition_options`* pode ser usado para controlar a partição da tabela criada com `CREATE TABLE`.

Nem todas as opções exibidas na sintaxe para *`partition_options`* no início desta seção estão disponíveis para todos os tipos de particionamento. Consulte as listagens para os seguintes tipos individuais para obter informações específicas para cada tipo, e consulte [Capítulo 22, *Partitioning*] (partitioning.html), para obter informações mais completas sobre o funcionamento e os usos do particionamento no MySQL, além de exemplos adicionais de criação de tabelas e outras declarações relacionadas ao particionamento do MySQL.

As partições podem ser modificadas, unidas, adicionadas a tabelas e removidas delas. Para obter informações básicas sobre as instruções MySQL para realizar essas tarefas, consulte Seção 13.1.8, “Instrução ALTER TABLE”. Para descrições e exemplos mais detalhados, consulte Seção 22.3, “Gestão de Partições”.

- `PARTITION BY`

  Se utilizada, uma cláusula `partition_options` começa com `PARTITION BY`. Esta cláusula contém a função usada para determinar a partição; a função retorna um valor inteiro variando de 1 a *`num`*, onde *`num`* é o número de partições. (O número máximo de partições definidas pelo usuário que uma tabela pode conter é de 1024; o número de subpartições — discutido mais adiante nesta seção — está incluído nesse máximo.)

  Nota

  A expressão (*`expr`*) usada em uma cláusula `PARTITION BY` não pode se referir a colunas que não estejam na tabela sendo criada; tais referências não são permitidas especificamente e causam o erro na execução da instrução. (Bug #29444)

- `HASH(expr)`

  Gera hashes em uma ou mais colunas para criar uma chave para a colocação e localização de linhas. *`expr`* é uma expressão que usa uma ou mais colunas da tabela. Isso pode ser qualquer expressão válida do MySQL (incluindo funções do MySQL) que produza um único valor inteiro. Por exemplo, estas são ambas declarações válidas de `CREATE TABLE` (create-table.html) usando `PARTITION BY HASH`:

  ```sql
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

  Você não pode usar cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

  `PARTITION BY HASH` usa o resto de *`expr`* dividido pelo número de partições (ou seja, o módulo). Para exemplos e informações adicionais, consulte Seção 22.2.4, "Partição HASH".

  A palavra-chave `LINEAR` implica em um algoritmo um pouco diferente. Neste caso, o número da partição em que uma linha é armazenada é calculado como o resultado de uma ou mais operações lógicas `AND` (operadores lógicos.html#operador_and). Para discussão e exemplos de hashing linear, consulte Seção 22.2.4.1, “Partição de Hash LINEAR”.

- `KEY(lista_colunas)`

  Isso é semelhante ao `HASH`, exceto que o MySQL fornece a função de hashing para garantir uma distribuição de dados uniforme. O argumento *`column_list`* é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples dividida por chave, com 4 partições:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

  Para tabelas que são particionadas por chave, você pode usar a particionamento linear usando a palavra-chave `LINEAR`. Isso tem o mesmo efeito que as tabelas que são particionadas por `HASH`. Ou seja, o número de partição é encontrado usando o operador `&` (bit-functions.html#operator_bitwise-and) em vez do módulo (veja Seção 22.2.4.1, “Particionamento LINEAR HASH”, e Seção 22.2.5, “Particionamento por CHAVE”, para detalhes). Este exemplo usa o particionamento linear por chave para distribuir os dados entre 5 partições:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

  A opção `ALGORITHM={1 | 2}` é suportada com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chaves que o MySQL 5.1; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chaves usadas por padrão para novas tabelas `KEY` particionadas no MySQL 5.7 e versões posteriores. Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada principalmente para uso ao atualizar tabelas `[LINEAR] KEY` particionadas do MySQL 5.1 para versões posteriores do MySQL. Para mais informações, consulte Seção 13.1.8.1, “Operações de Partição de Tabela ALTER”.

  **mysqldump** escreve essa opção em comentários versionados, como este:

  ```sql
  CREATE TABLE t1 (a INT)
  /*!50100 PARTITION BY KEY */ /*!50611 ALGORITHM = 1 */ /*!50100 ()
        PARTITIONS 3 */
  ```

  Isso faz com que os servidores do MySQL 5.6.10 e versões anteriores ignorem a opção, o que, de outra forma, causaria um erro de sintaxe nessas versões.

  `ALGORITHM=1` é exibido quando necessário na saída de `SHOW CREATE TABLE` usando comentários versionados da mesma maneira que **mysqldump**. `ALGORITHM=2` é sempre omitido da saída de `SHOW CREATE TABLE`, mesmo que essa opção tenha sido especificada ao criar a tabela original.

  Você não pode usar cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY KEY`.

- `RANGE(expr)`

  Neste caso, *`expr`* exibe uma faixa de valores usando um conjunto de operadores `MENOS QUE` (VALUES LESS THAN). Ao usar a partição por faixa, você deve definir pelo menos uma partição usando `MENOS QUE` (VALUES LESS THAN). Você não pode usar `IN` (VALUES IN) com a partição por faixa.

  Nota

  Para tabelas particionadas por `RANGE`, `VALUES LESS THAN` deve ser usado com um valor literal inteiro ou uma expressão que avalie a um único valor inteiro. No MySQL 5.7, você pode superar essa limitação em uma tabela que é definida usando `PARTITION BY RANGE COLUMNS`, conforme descrito mais adiante nesta seção.

  Suponha que você tenha uma tabela que deseja particionar em uma coluna que contém valores de ano, de acordo com o seguinte esquema.

  <table summary="Um esquema de partição de tabela baseado em uma coluna que contém valores de ano, conforme descrito no texto anterior. A tabela lista os números de partição e o intervalo correspondente de anos."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Número de Partição:</th> <th>Ano de produção:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 e anteriores</td> </tr><tr> <td>1</td> <td>1991 a 1994</td> </tr><tr> <td>2</td> <td>1995 a 1998</td> </tr><tr> <td>3</td> <td>1999 a 2002</td> </tr><tr> <td>4</td> <td>2003 a 2005</td> </tr><tr> <td>5</td> <td>2006 e depois</td> </tr></tbody></table>

  Uma tabela que implemente tal esquema de particionamento pode ser realizada pela instrução `CREATE TABLE` mostrada aqui:

  ```sql
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

  As cláusulas `VALUES MENOS QUE` funcionam sequencialmente de maneira semelhante às partes `case` de um bloco `switch ... case` (como encontrado em muitas linguagens de programação, como C, Java e PHP). Isso significa que as cláusulas devem ser organizadas de tal forma que o limite superior especificado em cada `VALUES MENOS QUE` subsequente seja maior que o do anterior, com a cláusula que referencia `MAXVALUE` sendo a última da lista.

- `RANGE COLUMNS(lista_colunas)`

  Esta variante do `RANGE` facilita o corte de partições para consultas que usam condições de intervalo em várias colunas (ou seja, com condições como `WHERE a = 1 AND b < 10` ou `WHERE a = 1 AND b = 10 AND c < 10`). Permite que você especifique intervalos de valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES LESS THAN (value_list)` (No caso mais simples, este conjunto consiste em uma única coluna). O número máximo de colunas que podem ser referenciadas no *`column_list`* e *`value_list`* é 16.

  A lista de *`column_list`* usada na cláusula `COLUMNS` pode conter apenas nomes de colunas; cada coluna na lista deve ser um dos seguintes tipos de dados do MySQL: os tipos inteiros; os tipos de string; e os tipos de colunas de hora ou data. Colunas que usam `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT` ou tipos de dados espaciais não são permitidas; colunas que usam tipos de números de ponto flutuante também não são permitidas. Você também não pode usar funções ou expressões aritméticas na cláusula `COLUMNS`.

  A cláusula `VALUES MENOS QUE` usada em uma definição de partição deve especificar um valor literal para cada coluna que aparece na cláusula `COLUMNS()`; ou seja, a lista de valores usada para cada cláusula `VALUES MENOS QUE` deve conter o mesmo número de valores que há de colunas listadas na cláusula `COLUMNS`. Uma tentativa de usar mais ou menos valores em uma cláusula `VALUES MENOS QUE` do que há de colunas listadas na cláusula `COLUMNS` causa a declaração a falhar com o erro Incoerência no uso de listas de colunas para partição.... Você não pode usar `NULL` para qualquer valor que apareça em `VALUES MENOS QUE`. É possível usar `MAXVALUE` mais de uma vez para uma coluna dada, exceto a primeira, como mostrado neste exemplo:

  ```sql
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

  Cada valor usado em uma lista de valores `MENOS QUE` deve corresponder exatamente ao tipo da coluna correspondente; nenhuma conversão é feita. Por exemplo, você não pode usar a string `'1'` para um valor que corresponde a uma coluna que usa um tipo inteiro (você deve usar o numeral `1` em vez disso), nem pode usar o numeral `1` para um valor que corresponde a uma coluna que usa um tipo de string (nesse caso, você deve usar uma string com aspas: `'1'`).

  Para mais informações, consulte Seção 22.2.1, “Divisão de Faixa” e Seção 22.4, “Rimação de Partições”.

- `LIST(expr)`

  Isso é útil ao atribuir partições com base em uma coluna de tabela com um conjunto restrito de valores possíveis, como um código de estado ou país. Nesse caso, todas as linhas relacionadas a um determinado estado ou país podem ser atribuídas a uma única partição, ou uma partição pode ser reservada para um determinado conjunto de estados ou países. É semelhante ao `RANGE`, exceto que apenas `VALUES IN` pode ser usado para especificar valores permitidos para cada partição.

  `VALUES IN` é usado com uma lista de valores a serem correspondidos. Por exemplo, você pode criar um esquema de partição como o seguinte:

  ```sql
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

  Para tabelas particionadas por `LIST`, a lista de valores usada com `VALUES IN` deve conter apenas valores inteiros. No MySQL 5.7, você pode superar essa limitação usando a particionamento por `LIST COLUMNS`, que é descrito mais adiante nesta seção.

- `LIST COLUMNS(lista_colunas)`

  Esta variante da cláusula `LIST` facilita o corte de partições para consultas que utilizam condições de comparação em várias colunas (ou seja, com condições como `WHERE a = 5 E b = 5` ou `WHERE a = 1 E b = 10 E c = 5`). Permite que você especifique valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES IN (value_list)`.

  As regras que regem os tipos de dados para a lista de colunas usadas em `LIST COLUMNS(column_list)` e a lista de valores usados em `VALUES IN(value_list)` são as mesmas que as usadas para a lista de colunas em `RANGE COLUMNS(column_list)` e a lista de valores em `VALUES LESS THAN(value_list)`, respectivamente, exceto que na cláusula `VALUES IN`, `MAXVALUE` não é permitido e você pode usar `NULL`.

  Há uma diferença importante entre a lista de valores usada para `VALUES IN` com `PARTITION BY LIST COLUMNS` em oposição ao uso com `PARTITION BY LIST`. Quando usado com `PARTITION BY LIST COLUMNS`, cada elemento na cláusula `VALUES IN` deve ser um *conjunto* de valores de coluna; o número de valores em cada conjunto deve ser o mesmo que o número de colunas usadas na cláusula `COLUMNS`, e os tipos de dados desses valores devem corresponder aos dos colunas (e ocorrer na mesma ordem). No caso mais simples, o conjunto consiste em uma única coluna. O número máximo de colunas que podem ser usadas no *`column_list`* e nos elementos que compõem o *`value_list`* é de 16.

  A tabela definida pela seguinte instrução `CREATE TABLE` fornece um exemplo de uma tabela que usa a partição `LIST COLUMNS`:

  ```sql
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

  O número de partições pode ser especificado opcionalmente com uma cláusula `PARTITIONS num`, onde *`num`* é o número de partições. Se ambas as cláusulas *e* quaisquer cláusulas `PARTITION` forem usadas, *`num`* deve ser igual ao número total de quaisquer partições declaradas usando as cláusulas `PARTITION`.

  Nota

  Se você usar ou não a cláusula `PARTITIONS` ao criar uma tabela que é particionada por `RANGE` ou `LIST`, você ainda deve incluir pelo menos uma cláusula `PARTITION VALUES` na definição da tabela (veja abaixo).

- `SUBPARTITION BY`

  Uma partição pode ser dividida opcionalmente em vários subpartições. Isso pode ser indicado usando a cláusula opcional `SUBPARTITION BY`. A subpartição pode ser feita por `HASH` ou `KEY`. Qualquer uma dessas pode ser `LINEAR`. Eles funcionam da mesma maneira que foram descritos anteriormente para os tipos de partição equivalentes. (Não é possível subpartição por `LIST` ou `RANGE`.)

  O número de subpartições pode ser indicado usando a palavra-chave `SUBPARTITIONS`, seguida de um valor inteiro.

- É aplicada uma verificação rigorosa do valor utilizado nas cláusulas `PARTITIONS` ou `SUBPARTITIONS`, e esse valor deve seguir as seguintes regras:

  - O valor deve ser um inteiro positivo e não nulo.
  - Não são permitidos zeros significativos.
  - O valor deve ser um literal inteiro e não pode ser uma expressão. Por exemplo, `PARTITIONS 0.2E+01` não é permitido, mesmo que `0.2E+01` seja avaliado como `2`. (Bug #15890)

- `definição_partição`

  Cada partição pode ser definida individualmente usando uma cláusula *`partition_definition`*. As partes individuais que compõem essa cláusula são as seguintes:

  - `PARTITION nome_da_partição`

    Especifica um nome lógico para a partição.

  - `VALORES`

    Para a partição por intervalo, cada partição deve incluir uma cláusula `VALUES LESS THAN` (MENOS QUE); para a partição por lista, você deve especificar uma cláusula `VALUES IN` (IN) para cada partição. Isso é usado para determinar quais linhas devem ser armazenadas nesta partição. Consulte as discussões sobre os tipos de partição no [Capítulo 22, *Partição*] (partitioning.html), para exemplos de sintaxe.

  - `[ARMAZENAMENTO] MOTOR`

    O manipulador de partição aceita uma opção `[STORAGE] ENGINE` tanto para `PARTITION` quanto para `SUBPARTITION`. Atualmente, a única maneira de usá-la é definir todas as partições ou todas as subpartições no mesmo motor de armazenamento, e uma tentativa de definir motores de armazenamento diferentes para partições ou subpartições na mesma tabela gera o erro ERROR 1469 (HY000): A mistura de manipuladores nas partições não é permitida nesta versão do MySQL. Esperamos remover essa restrição sobre a partição em uma futura versão do MySQL.

  - `COMENTÁRIO`

    Uma cláusula `COMMENT` opcional pode ser usada para especificar uma string que descreve a partição. Exemplo:

    ```sql
    COMMENT = 'Data for the years previous to 1999'
    ```

    O comprimento máximo de um comentário de partição é de 1024 caracteres.

  - `DIÁRIO DE DADOS` e `DIÁRIO DE ÍNDICES`

    `DATA DIRECTORY` e `INDEX DIRECTORY` podem ser usados para indicar o diretório onde, respectivamente, os dados e os índices para esta partição devem ser armazenados. Tanto o `data_dir` quanto o `index_dir` devem ser nomes de caminho absoluto do sistema.

    A partir do MySQL 5.7.17, você deve ter o privilégio `FILE` para usar a opção de partição `DATA DIRECTORY` ou `INDEX DIRECTORY`.

    Exemplo:

    ```sql
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

    O `DATA DIRECTORY` e o `INDEX DIRECTORY` funcionam da mesma maneira que a cláusula *`table_option`* da instrução `CREATE TABLE`, conforme usado para tabelas `MyISAM`.

    Um diretório de dados e um diretório de índice podem ser especificados por partição. Se não forem especificados, os dados e índices são armazenados, por padrão, no diretório do banco de dados da tabela.

    No Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para partições ou subpartições individuais de tabelas de `[MyISAM]` (myisam-storage-engine.html), e a opção `INDEX DIRECTORY` não é suportada para partições ou subpartições individuais de tabelas de `[InnoDB]` (innodb-storage-engine.html). Essas opções são ignoradas no Windows, exceto que um aviso é gerado. (Bug #30459)

    Nota

    As opções `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas ao criar tabelas particionadas se `NO_DIR_IN_CREATE` estiver em vigor. (Bug #24633)

  - `MAX_ROWS` e `MIN_ROWS`

    Podem ser usadas para especificar, respectivamente, o número máximo e mínimo de linhas a serem armazenadas na partição. Os valores para *`max_number_of_rows`* e *`min_number_of_rows`* devem ser inteiros positivos. Assim como as opções de nível de tabela com os mesmos nomes, essas atuam apenas como “sugestões” para o servidor e não são limites rígidos.

  - `TABLESPACE`

    Pode ser usado para designar um espaço de tabela para a partição. Suportado pelo NDB Cluster. Para tabelas `InnoDB`, pode ser usado para designar um espaço de tabela por arquivo para a partição, especificando `TABLESPACE `innodb_file_per_table\`. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento.

    Nota

    O suporte para a colocação de partições de tabelas `InnoDB` em espaços de tabelas `InnoDB` compartilhados é descontinuado no MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL. Os espaços de tabelas compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabelas gerais.

- `subpartição_definição`

  A definição de partição pode opcionalmente conter uma ou mais cláusulas *`subpartição_definição`*. Cada uma dessas consiste, no mínimo, no `SUBPARTITION nome`, onde *`nome`* é um identificador para a subpartição. Exceto pela substituição da palavra-chave `PARTITION` pela `SUBPARTITION`, a sintaxe para uma definição de subpartição é idêntica à de uma definição de partição.

  A subpartição deve ser feita por `HASH` ou `KEY` e só pode ser feita em partições `RANGE` ou `LIST`. Veja Seção 22.2.6, “Subpartição”.

**Divisão por Colunas Geradas**

A partição por colunas geradas é permitida. Por exemplo:

```sql
CREATE TABLE t1 (
  s1 INT,
  s2 INT AS (EXP(s1)) STORED
)
PARTITION BY LIST (s2) (
  PARTITION p1 VALUES IN (1)
);
```

A partição considera uma coluna gerada como uma coluna regular, o que permite contornar as limitações em funções que não são permitidas para partição (consulte Seção 22.6.3, “Limitações de Partição Relativas a Funções”). O exemplo anterior demonstra essa técnica: a função `EXP()` não pode ser usada diretamente na cláusula `PARTITION BY`, mas uma coluna gerada definida usando `EXP()` é permitida.
