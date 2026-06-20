## 13.1 Declarações de Definição de Dados

### 13.1.1 Declaração ALTER DATABASE

```sql
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...
ALTER {DATABASE | SCHEMA} db_name
    UPGRADE DATA DIRECTORY NAME

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
}
```

`ALTER DATABASE` permite que você mude as características gerais de um banco de dados. Essas características são armazenadas no arquivo `db.opt` no diretório do banco de dados. Essa declaração requer o privilégio `ALTER` no banco de dados. `ALTER SCHEMA` é sinônimo de `ALTER DATABASE`.

O nome do banco de dados pode ser omitido na primeira sintaxe, nesse caso a declaração se aplica ao banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

* Opções de Conjunto de Caracteres e Colaboração * Atualizando versões anteriores ao MySQL 5.1

#### Conjunto de caracteres e opções de codificação

A cláusula `CHARACTER SET` altera o conjunto de caracteres padrão do banco de dados. A cláusula `COLLATE` altera a collation padrão do banco de dados. Para informações sobre os nomes dos conjuntos de caracteres e collation, consulte o Capítulo 10, * Conjuntos de caracteres, collation, Unicode *.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 13.7.5.3, “Declaração SHOW CHARACTER SET”, e a Seção 13.7.5.4, “Declaração SHOW COLLATION”.

Uma rotina armazenada que usa os padrões do banco de dados quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma rotina armazenada, as variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a correção não forem especificados explicitamente. Veja a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.) Se você alterar o conjunto de caracteres padrão ou a correção de um banco de dados, todas as rotinas armazenadas que devem usar os novos padrões devem ser excluídas e recriadas.

#### Atualizando versões anteriores ao MySQL 5.1

A sintaxe que inclui a cláusula `UPGRADE DATA DIRECTORY NAME` atualiza o nome do diretório associado ao banco de dados para usar a codificação implementada no MySQL 5.1 para mapear nomes de banco de dados a nomes de diretórios de banco de dados (consulte Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”). Esta cláusula é para uso nessas condições:

* É necessário fazer isso ao atualizar o MySQL para a versão 5.1 ou superior a partir de versões mais antigas.

* Pretende-se atualizar o nome do diretório do banco de dados para o formato de codificação atual, se o nome contiver caracteres especiais que precisam de codificação.

* A declaração é usada pelo **mysqlcheck** (como invocado por `mysqld_upgrade`).

Por exemplo, se um banco de dados no MySQL 5.0 tiver o nome `a-b-c`, o nome contém instâncias do caractere `-` (barra). No MySQL 5.0, o diretório do banco de dados também é nomeado `a-b-c`, o que não é necessariamente seguro para todos os sistemas de arquivos. Em MySQL 5.1 e posterior, o mesmo nome do banco de dados é codificado como `a@002db@002dc` para produzir um nome de diretório neutro em relação ao sistema de arquivos.

Quando uma instalação do MySQL é atualizada para o MySQL 5.1 ou posterior a partir de uma versão mais antiga, o servidor exibe um nome como `a-b-c` (que está no formato antigo) como `#mysql50#a-b-c`, e você deve se referir ao nome usando o prefixo `#mysql50#`. Use `UPGRADE DATA DIRECTORY NAME` neste caso para indicar explicitamente ao servidor que re-encode o nome do diretório do banco de dados para o formato de codificação atual:

```sql
ALTER DATABASE `#mysql50#a-b-c` UPGRADE DATA DIRECTORY NAME;
```

Após executar essa declaração, você pode se referir ao banco de dados como `a-b-c` sem o prefixo especial `#mysql50#`.

Nota

A cláusula `UPGRADE DATA DIRECTORY NAME` é desaconselhada no MySQL 5.7 e removida no MySQL 8.0. Se for necessário converter nomes de bancos de dados ou tabelas do MySQL 5.0, uma solução é atualizar uma instalação do MySQL 5.0 para o MySQL 5.1 antes de atualizar para o MySQL 8.0.

### 13.1.2 Declaração de ALTER EVENT

```sql
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    [DO event_body]
```

A declaração `ALTER EVENT` altera uma ou mais características de um evento existente sem a necessidade de descartá-lo e recriá-lo. A sintaxe de cada uma das cláusulas `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE` e `DO` é exatamente a mesma quando usada com `CREATE EVENT`. (Veja a Seção 13.1.12, “Declaração CREATE EVENT”.)

Qualquer usuário pode alterar um evento definido em um banco de dados para o qual esse usuário tenha o privilégio `EVENT`. Quando um usuário executa uma declaração `ALTER EVENT` bem-sucedida, esse usuário se torna o definidor do evento afetado.

`ALTER EVENT` funciona apenas com um evento existente:

```sql
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

Em cada um dos exemplos a seguir, vamos assumir que o evento denominado `myevent` é definido conforme mostrado aqui:

```sql
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A seguinte declaração altera o cronograma para `myevent` de uma vez a cada seis horas, começando imediatamente, para uma vez a cada doze horas, começando quatro horas após o momento em que a declaração é executada:

```sql
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

É possível alterar várias características de um evento em uma única declaração. Este exemplo altera a declaração SQL executada por `myevent` para uma que exclui todos os registros de `mytable`; também altera o cronograma do evento de modo que ele seja executado uma vez, um dia após a execução desta declaração `ALTER EVENT`.

```sql
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Especificar as opções em uma declaração `ALTER EVENT` apenas para as características que você deseja alterar; as opções omitidas mantêm seus valores existentes. Isso inclui quaisquer valores padrão para `CREATE EVENT`, como `ENABLE`.

Para desabilitar `myevent`, use esta declaração `ALTER EVENT`:

```sql
ALTER EVENT myevent
    DISABLE;
```

A cláusula `ON SCHEDULE` pode utilizar expressões que envolvam funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Não é possível usar rotinas armazenadas ou funções carregáveis nessas expressões, e não é possível usar referências a tabelas; no entanto, é possível usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as declarações `ALTER EVENT` quanto `CREATE EVENT`. Referências a rotinas armazenadas, funções carregáveis e tabelas nessas situações não são especificamente permitidas e falham com um erro (veja o Bug #22830).

Embora uma declaração `ALTER EVENT` que contém outra declaração `ALTER EVENT` em sua cláusula `DO` pareça ter sucesso, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Para renomear um evento, use a cláusula `RENAME TO` da declaração `ALTER EVENT`. Esta declaração renomeia o evento `myevent` para `yourevent`:

```sql
ALTER EVENT myevent
    RENAME TO yourevent;
```

Você também pode mover um evento para um banco de dados diferente usando a notação `ALTER EVENT ... RENAME TO ...` e `db_name.event_name`, conforme mostrado aqui:

```sql
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

Para executar a declaração anterior, o usuário que a executa deve ter o privilégio `EVENT` nos bancos de dados `olddb` e `newdb`.

Nota

Não há nenhuma declaração `RENAME EVENT`.

O valor `DISABLE ON SLAVE` é usado em uma réplica em vez de `ENABLE` ou `DISABLE` para indicar um evento que foi criado na fonte e replicado para a réplica, mas que não é executado na réplica. Normalmente, `DISABLE ON SLAVE` é definido automaticamente conforme necessário; no entanto, há algumas circunstâncias em que você pode querer ou precisar alterá-lo manualmente. Consulte a Seção 16.4.1.16, “Replicação de Recursos Invocáveis”, para obter mais informações.

### 13.1.3 Declaração ALTER FUNCTION

```sql
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Essa declaração pode ser usada para alterar as características de uma função armazenada. Mais de uma alteração pode ser especificada em uma declaração `ALTER FUNCTION`. No entanto, você não pode alterar os parâmetros ou o corpo de uma função armazenada usando essa declaração; para fazer tais alterações, você deve descartar e recriar a função usando `DROP FUNCTION` e `CREATE FUNCTION`.

Você deve ter o privilégio `ALTER ROUTINE` para a função. (Esse privilégio é concedido automaticamente ao criador da função.) Se o registro binário estiver habilitado, a declaração `ALTER FUNCTION` também pode exigir o privilégio `SUPER`, conforme descrito na Seção 23.7, “Registro Binário de Programa Armazenado”.

### 13.1.4 Declaração ALTER INSTANCE

```sql
ALTER INSTANCE ROTATE INNODB MASTER KEY
```

`ALTER INSTANCE`, introduzido no MySQL 5.7.11, define ações aplicáveis a uma instância do servidor MySQL. A declaração suporta essas ações:

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

Essa ação roda a chave de criptografia mestre usada para a criptografia do espaço de tabela `InnoDB`. A rotação da chave requer o privilégio `SUPER`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte a Seção 6.4.4, “O Keyring do MySQL”.

`ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta operações DML concorrentes. No entanto, não pode ser executado concorrentemente com as operações de `CREATE TABLE ... ENCRYPTION` ou `ALTER TABLE ... ENCRYPTION`, e são tomadas assegurações para evitar conflitos que poderiam surgir da execução concorrente dessas declarações. Se uma das declarações em conflito estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

As ações `ALTER INSTANCE` são escritas no log binário para que possam ser executadas em servidores replicados.

Para informações adicionais sobre o uso do `ALTER INSTANCE ROTATE INNODB MASTER KEY`, consulte a Seção 14.14, “Encriptação de Dados em Repouso do InnoDB”. Para informações sobre plugins de chave, consulte a Seção 6.4.4, “O Keyring do MySQL”.

### 13.1.5 Declaração ALTER LOGFILE GROUP

```sql
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Essa declaração adiciona um arquivo `UNDO` denominado '*`file_name`*' a um grupo de arquivos de registro existente *`logfile_group`*. Uma declaração `ALTER LOGFILE GROUP` tem uma e apenas uma cláusula `ADD UNDOFILE`. A cláusula `DROP UNDOFILE` atualmente não é suportada.

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um arquivo de log de desfazer com o mesmo nome, ou um arquivo de log de desfazer e um arquivo de dados com o mesmo nome.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO` em bytes; se não especificado, o tamanho inicial é definido como 134217728 (128 MB). Você pode opcionalmente seguir *`size`* com uma abreviação de uma ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB). (Bug #29574)

Nota

`WAIT` é analisado, mas ignorado de outra forma. Este termo-chave atualmente não tem efeito e é destinado para expansão futura.

O parâmetro `ENGINE` (requerido) determina o motor de armazenamento que é usado por este grupo de arquivos de registro, com *`engine_name`* sendo o nome do motor de armazenamento. Atualmente, os únicos valores aceitos para *`engine_name`* são “`NDBCLUSTER`” e “`NDB`”. Os dois valores são equivalentes.

Aqui está um exemplo, que assume que o grupo de arquivo de registro `lg_3` já foi criado usando `CREATE LOGFILE GROUP` (consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”):

```sql
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

Quando o `ALTER LOGFILE GROUP` é usado com o `ENGINE = NDBCLUSTER` (alternativamente, `ENGINE = NDB`), um arquivo de registro `UNDO` é criado em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles consultando a tabela do Esquema de Informações `FILES`. Por exemplo:

```sql
mysql> SELECT FILE_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE LOGFILE_GROUP_NAME = 'lg_3';
+-------------+----------------------+----------------+
| FILE_NAME   | LOGFILE_GROUP_NUMBER | EXTRA          |
+-------------+----------------------+----------------+
| newdata.dat |                    0 | CLUSTER_NODE=3 |
| newdata.dat |                    0 | CLUSTER_NODE=4 |
| undo_10.dat |                   11 | CLUSTER_NODE=3 |
| undo_10.dat |                   11 | CLUSTER_NODE=4 |
+-------------+----------------------+----------------+
4 rows in set (0.01 sec)
```

(Veja a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”).

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

`ALTER LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Para mais informações, consulte a Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster”.

### 13.1.6 Declaração de Procedimento ALTER PROCEDURE

```sql
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Essa declaração pode ser usada para alterar as características de um procedimento armazenado. Mais de uma alteração pode ser especificada em uma declaração `ALTER PROCEDURE`. No entanto, você não pode alterar os parâmetros ou o corpo de um procedimento armazenado usando essa declaração; para fazer tais alterações, você deve descartar e recriar o procedimento usando `DROP PROCEDURE` e `CREATE PROCEDURE`.

Você deve ter o privilégio `ALTER ROUTINE` para o procedimento. Por padrão, esse privilégio é concedido automaticamente ao criador do procedimento. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

### 13.1.7 Declaração ALTER SERVER

```sql
ALTER SERVER  server_name
    OPTIONS (option [, option] ...)
```

Altera as informações do servidor para `server_name`, ajustando qualquer uma das opções permitidas na declaração `CREATE SERVER`. Os campos correspondentes na tabela `mysql.servers` são atualizados conforme necessário. Esta declaração requer o privilégio `SUPER`.

Por exemplo, para atualizar a opção `USER`:

```sql
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causa um commit implícito. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

`ALTER SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 13.1.8 Declaração ALTER TABLE

```sql
ALTER TABLE tbl_name
    [alter_option [, alter_option] ...]
    [partition_options]

alter_option: {
    table_options
  | ADD [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ADD [COLUMN] (col_name column_definition,...)
  | ADD {INDEX | KEY} [index_name]
        [index_type] (key_part,...) [index_option] ...
  | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
        (key_part,...) [index_option] ...
  | ADD [CONSTRAINT [symbol]] PRIMARY KEY
        [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
        [index_name] [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] FOREIGN KEY
        [index_name] (col_name,...)
        reference_definition
  | ADD CHECK (expr)
  | ALGORITHM [=] {DEFAULT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | DROP DEFAULT
    }
  | CHANGE [COLUMN] old_col_name new_col_name column_definition
        [FIRST | AFTER col_name]
  | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
  | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
  | {DISABLE | ENABLE} KEYS
  | {DISCARD | IMPORT} TABLESPACE
  | DROP [COLUMN] col_name
  | DROP {INDEX | KEY} index_name
  | DROP PRIMARY KEY
  | DROP FOREIGN KEY fk_symbol
  | FORCE
  | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
  | MODIFY [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ORDER BY col_name [, col_name] ...
  | RENAME {INDEX | KEY} old_index_name TO new_index_name
  | RENAME [TO | AS] new_tbl_name
  | {WITHOUT | WITH} VALIDATION
}

partition_options:
    partition_option [partition_option] ...

partition_option: {
    ADD PARTITION (partition_definition)
  | DROP PARTITION partition_names
  | DISCARD PARTITION {partition_names | ALL} TABLESPACE
  | IMPORT PARTITION {partition_names | ALL} TABLESPACE
  | TRUNCATE PARTITION {partition_names | ALL}
  | COALESCE PARTITION number
  | REORGANIZE PARTITION partition_names INTO (partition_definitions)
  | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
  | ANALYZE PARTITION {partition_names | ALL}
  | CHECK PARTITION {partition_names | ALL}
  | OPTIMIZE PARTITION {partition_names | ALL}
  | REBUILD PARTITION {partition_names | ALL}
  | REPAIR PARTITION {partition_names | ALL}
  | REMOVE PARTITIONING
  | UPGRADE PARTITIONING
}

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

table_options:
    table_option [[,] table_option] ...

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
  | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    (see CREATE TABLE options)
```

`ALTER TABLE` altera a estrutura de uma tabela. Por exemplo, você pode adicionar ou excluir colunas, criar ou destruir índices, alterar o tipo de colunas existentes ou renomear colunas ou a própria tabela. Você também pode alterar características como o mecanismo de armazenamento usado para a tabela ou o comentário da tabela.

* Para usar `ALTER TABLE`, você precisa de `ALTER`, `CREATE` e `INSERT` privilégios para a tabela. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `ALTER`, `CREATE` e `INSERT` na nova tabela.

* Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for dada, `ALTER TABLE` não faz nada.

* A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da declaração `CREATE TABLE`. *`column_definition`* As cláusulas usam a mesma sintaxe para `ADD` e `CHANGE` como para `CREATE TABLE`. Para mais informações, consulte a Seção 13.1.18, “Declaração CREATE TABLE”.

* A palavra `COLUMN` é opcional e pode ser omitida.

* Múltiplas cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única declaração `ALTER TABLE`, separadas por vírgulas. Esta é uma extensão do MySQL ao SQL padrão, que permite apenas uma cláusula por declaração `ALTER TABLE`. Por exemplo, para descartar múltiplas colunas em uma única declaração, faça o seguinte:

  ```sql
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* Se um mecanismo de armazenamento não suportar uma operação `ALTER TABLE` tentativa, pode resultar em um aviso. Tais avisos podem ser exibidos com `SHOW WARNINGS`. Consulte a Seção 13.7.5.40, “Declaração SHOW WARNINGS”. Para informações sobre a solução de problemas de `ALTER TABLE`, consulte a Seção B.3.6.1, “Problemas com ALTER TABLE”.

* Para informações sobre colunas geradas, consulte a Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”.

* Para exemplos de uso, consulte a Seção 13.1.8.3, “Exemplos de ALTER TABLE”.

* Com a função API `mysql_info()` C, você pode descobrir quantas strings foram copiadas por `ALTER TABLE`. Veja `mysql_info()`.

Existem vários aspectos adicionais à declaração `ALTER TABLE`, descritos nos seguintes tópicos desta seção:

* Opções de tabela
* Requisitos de desempenho e espaço
* Controle de concorrência
* Adicionar e remover colunas
* Renomear, redefinir e reorganizar colunas
* Chaves primárias e índices
* Chaves estrangeiras e outras restrições
* Alterar o conjunto de caracteres
* Descartar e importar espaços de tabela InnoDB
* Ordem de string para tabelas MyISAM
* Opções de particionamento

#### Opções de tabela

*`table_options`* indica opções de tabela do tipo que podem ser usadas na declaração `CREATE TABLE`, como `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT` ou `TABLESPACE`.

Para descrições de todas as opções de tabela, consulte a Seção 13.1.18, “Instrução CREATE TABLE”. No entanto, `ALTER TABLE` ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. `ALTER TABLE` permite que eles sejam usados apenas como opções de particionamento, e, a partir do MySQL 5.7.17, exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com `ALTER TABLE` oferece uma maneira conveniente de alterar características de uma única tabela. Por exemplo:

* Se `t1` atualmente não for uma tabela `InnoDB`, esta declaração altera seu mecanismo de armazenamento para `InnoDB`:

  ```sql
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

+ Veja a Seção 14.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”, para considerações ao mudar as tabelas para o mecanismo de armazenamento `InnoDB`.

+ Quando você especifica uma cláusula `ENGINE`, `ALTER TABLE` reconstrui a tabela. Isso é verdade mesmo que a tabela já tenha o motor de armazenamento especificado.

Executar `ALTER TABLE tbl_name ENGINE=INNODB` em uma tabela existente `InnoDB` realiza uma operação de `ALTER TABLE` “nulo”, que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito na Seção 14.12.4, “Desfragmentando uma tabela”. Executar `ALTER TABLE tbl_name FORCE` em uma tabela `InnoDB` realiza a mesma função.

+ `ALTER TABLE tbl_name ENGINE=INNODB` e `ALTER TABLE tbl_name FORCE` utilizam DDL online. Para mais informações, consulte a Seção 14.13, “InnoDB e DDL online”.

+ O resultado do tentativa de alterar o motor de armazenamento de uma tabela é afetado pela disponibilidade do motor de armazenamento desejado e pela configuração do modo `NO_ENGINE_SUBSTITUTION` SQL, conforme descrito na Seção 5.1.10, "Modos SQL do servidor".

+ Para evitar a perda acidental de dados, `ALTER TABLE` não pode ser usado para alterar o motor de armazenamento de uma tabela para `MERGE` ou `BLACKHOLE`.

* Para alterar a tabela `InnoDB` para usar o formato de armazenamento de strings comprimido:

  ```sql
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* Para habilitar ou desabilitar a criptografia para uma tabela `InnoDB` em um espaço de tabela por arquivo:

  ```sql
  ALTER TABLE t1 ENCRYPTION='Y';
  ALTER TABLE t1 ENCRYPTION='N';
  ```

Um plugin de chave de acesso deve ser instalado e configurado para usar a opção `ENCRYPTION`. Para mais informações, consulte a Seção 14.14, “Encriptação de dados em repouso do InnoDB”.

A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se a tabela já estiver usando `InnoDB` (e você não alterar o motor de armazenamento da tabela), ou se a declaração `ALTER TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a declaração é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

* Para redefinir o valor atual de auto-incremento:

  ```sql
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

Você não pode redefinir o contador para um valor menor ou igual ao valor que está atualmente em uso. Para ambos os `InnoDB` e `MyISAM`, se o valor for menor ou igual ao valor máximo atualmente na coluna `AUTO_INCREMENT`, o valor é redefinido para o valor atual da coluna `AUTO_INCREMENT` mais um.

* Para alterar o conjunto de caracteres padrão da tabela:

  ```sql
  ALTER TABLE t1 CHARACTER SET = utf8;
  ```

Veja também Alterar o conjunto de caracteres.

* Para adicionar (ou alterar) um comentário em uma tabela:

  ```sql
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` com a opção `TABLESPACE` para mover as tabelas `InnoDB` entre espaços de tabelas gerais existentes, espaços de tabela por arquivo e o espaço de tabelas do sistema. Veja Movimentando tabelas entre espaços de tabelas usando ALTER TABLE.

As operações do `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

+ A sintaxe do `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

+ A cláusula `DATA DIRECTORY`, que é suportada com `CREATE TABLE ... TABLESPACE`, não é suportada com `ALTER TABLE ... TABLESPACE`, e é ignorada se especificada.

+ Para mais informações sobre as capacidades e limitações da opção `TABLESPACE`, consulte `CREATE TABLE`.

* O MySQL NDB Cluster 7.5.2 e versões posteriores permitem definir as opções `NDB_TABLE` para controlar o equilíbrio de partição de uma tabela (tipo de contagem de fragmentos), capacidade de leitura a partir de qualquer réplica, replicação completa ou qualquer combinação dessas opções, como parte do comentário da tabela para uma declaração `ALTER TABLE` no mesmo modo que para `CREATE TABLE`, conforme mostrado neste exemplo:

  ```sql
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

É também possível definir opções de `NDB_COMMENT` para colunas de tabelas de `NDB` como parte de uma declaração de `ALTER TABLE`, como esta:

  ```sql
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=MAX_BLOB_PART_SIZE';
  ```

Tenha em mente que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte Opções de NDB_TABLE para obter informações adicionais e exemplos.

Para verificar se as opções da tabela foram alteradas conforme o esperado, use `SHOW CREATE TABLE`, ou consulte a tabela do esquema de informações `TABLES`.

#### Requisitos de desempenho e espaço

As operações `ALTER TABLE` são processadas usando um dos seguintes algoritmos:

* `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova string de tabela string a string. O DML concorrente não é permitido.

* `INPLACE`: As operações não evitam a cópia dos dados da tabela, mas podem reconstruí-la no local. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante as fases de preparação e execução da operação. Normalmente, o DML concorrente é suportado.

Para tabelas que utilizam o mecanismo de armazenamento `NDB`, esses algoritmos funcionam da seguinte forma:

* `COPY`: `NDB` cria uma cópia da tabela e a altera; o manipulador do NDB Cluster então copia os dados entre as versões antigas e novas da tabela. Posteriormente, `NDB` exclui a tabela antiga e renomeia a nova.

Isso é, por vezes, referido como uma "cópia" ou `ALTER TABLE` "offline".

* `INPLACE`: Os nós de dados fazem as alterações necessárias; o manipulador do NDB Cluster não copia dados ou não participa de outra forma.

Isso é, por vezes, referido como uma `ALTER TABLE` "não copiada" ou "online".

Consulte a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INPLACE` para motores de armazenamento e as cláusulas `ALTER TABLE` que a suportam. Caso contrário, é usada a cláusula `ALGORITHM=COPY`.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para cláusulas e motores de armazenamento que o suportam, ou falhe com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula [[`ALGORITHM`].

`ALTER TABLE` as operações que utilizam o algoritmo `COPY` aguardam a conclusão de outras operações que estão modificando a tabela. Após as alterações serem aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação `ALTER TABLE` é executada, a tabela original é legível por outras sessões (com a exceção mencionada brevemente). As atualizações e escritas na tabela iniciadas após o início da operação `ALTER TABLE` são suspensas até que a nova tabela esteja pronta, e então são automaticamente redirecionadas para a nova tabela. A cópia temporária da tabela é criada no diretório do banco de dados da tabela original, a menos que seja uma operação `RENAME TO` que move a tabela para um banco de dados que reside em um diretório diferente.

A exceção mencionada anteriormente é que o bloco `ALTER TABLE` lê (não apenas escreve) no ponto em que está pronto para instalar uma nova versão do arquivo de tabela `.frm`, descarta o arquivo antigo e limpa as estruturas de tabela desatualizadas dos caches de definição de tabela e de cache. Neste ponto, ele deve adquirir um bloqueio exclusivo. Para isso, ele espera que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` impede operações DML concorrentes. Perguntas concorrentes ainda são permitidas. Isso significa que uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permitir consultas, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK`, especificando `LOCK=EXCLUSIVE`, que impede DML e consultas. Para mais informações, consulte Controle de Concorrência.

Para forçar o uso do algoritmo `COPY` para uma operação `ALTER TABLE` que, de outra forma, não a usaria, habilite a variável de sistema `old_alter_table` ou especifique `ALGORITHM=COPY`. Se houver um conflito entre o ajuste `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` tem precedência.

Para as tabelas `InnoDB`, uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações requerem tanto espaço adicional quanto os dados na tabela mais os índices. Para uma tabela que reside em um espaço de tabelas compartilhado, o espaço adicional usado durante a operação não é liberado de volta ao sistema operacional, como é o caso de uma tabela que reside em um espaço de tabelas por tabela.

Para informações sobre os requisitos de espaço para operações DDL online, consulte a Seção 14.13.3, “Requisitos de espaço DDL online”.

As operações `ALTER TABLE` que suportam o algoritmo `INPLACE` incluem:

* As operações `ALTER TABLE` são suportadas pelo recurso DDL online `InnoDB`. Veja a Seção 14.13.1, “Operações DDL Online”.

* Renomear uma tabela. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a declaração `RENAME TABLE` para renomear tabelas. Veja Seção 13.1.33, “Declaração RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

* Operações que apenas modificam o metadados da tabela. Essas operações são imediatas, pois o servidor apenas altera o arquivo da tabela `.frm`, não tocando no conteúdo da tabela. As operações que apenas modificam metadados incluem:

+ Renomear uma coluna.  
+ Alterar o valor padrão de uma coluna (exceto para as tabelas `NDB`).

+ Modificando a definição de uma coluna `ENUM` ou `SET` ao adicionar novos membros de enumeração ou conjunto ao *final* da lista de valores de membro válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

* Renomear um índice. * Adicionar ou remover um índice secundário, para as tabelas `InnoDB` e `NDB`. Veja a Seção 14.13, “InnoDB e DDL Online”.

* Para as tabelas `NDB`, operações que adicionam e excluem índices em colunas de largura variável. Essas operações ocorrem online, sem cópia da tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Veja a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`ALTER TABLE` atualiza as colunas temporais do MySQL 5.5 para o formato 5.6 para as operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser feita usando o algoritmo `INPLACE`, porque a tabela deve ser reconstruída, então especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um índice multicoluna que foi usada para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só pode ser realizada usando `ALGORITHM=COPY`.

As cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION` afetam se a cláusula `ALTER TABLE` realiza uma operação in-place para modificações de coluna geradas virtualmente. Veja a Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”.

O NDB Cluster anteriormente suportava operações online `ALTER TABLE` usando as palavras-chave `ONLINE` e `OFFLINE`. Essas palavras-chave não são mais suportadas; seu uso causa um erro de sintaxe. O MySQL NDB Cluster 7.5 (e posterior) suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. `NDB` não suporta a alteração de um espaço de tabela online. Consulte a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

`ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria nenhuma tabela temporária ou arquivos de partição temporária.

`ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usado com tabelas `NDB`; no entanto, essas operações podem e criam arquivos de partição temporários.

As operações `ADD` ou `DROP` para as partições `RANGE` ou `LIST` são operações imediatas ou quase imediatas. As operações `ADD` ou `COALESCE` para as partições `HASH` ou `KEY` copiam dados entre todas as partições, a menos que `LINEAR HASH` ou `LINEAR KEY` tenha sido usado; isso é efetivamente o mesmo que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada partição por partição. As operações `REORGANIZE` copiam apenas as partições alteradas e não tocam nas não alteradas.

Para as tabelas `MyISAM`, você pode acelerar a recriação do índice (a parte mais lenta do processo de alteração) definindo a variável de sistema `myisam_sort_buffer_size` para um valor alto.

#### Controle de Concorrência

Para operações `ALTER TABLE` que a suportam, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não padrão para esta cláusula permite que você exija um certo nível de acesso ou exclusividade concorrente durante a operação de alteração, e interrompe a operação se o grau de bloqueio solicitado não estiver disponível. Os parâmetros para a cláusula `LOCK` são:

* `LOCK = DEFAULT`

Nível máximo de concorrência para a cláusula `ALGORITHM` (se houver) e operação `ALTER TABLE`: Permita leituras e escritas concorrentes se estiverem suportadas. Se não estiverem, permita leituras concorrentes se estiverem suportadas. Se não estiverem, implemente acesso exclusivo.

* `LOCK = NONE`

Se for suportado, permita leituras e escritas concorrentes. Caso contrário, ocorrerá um erro.

* `LOCK = SHARED`

Se for suportada, permita leituras concorrentes, mas bloqueie as escritas. As escritas são bloqueadas mesmo que as escritas concorrentes sejam suportadas pelo motor de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`. Se as leituras concorrentes não forem suportadas, ocorre um erro.

* `LOCK = EXCLUSIVE`

Forçar acesso exclusivo. Isso é feito mesmo que leituras/escritas concorrentes sejam suportadas pelo motor de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`.

#### Adicionando e removendo colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão do MySQL para SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma string de tabela, use `FIRST` ou `AFTER col_name`. O padrão é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser removida. Se o que você pretende é remover a tabela, use a declaração `DROP TABLE` em vez disso.

Se as colunas forem excluídas de uma tabela, elas também serão removidas de qualquer índice do qual fazem parte. Se todas as colunas que compõem um índice forem excluídas, o índice também será excluído.

#### Renomear, redefinir e reorganizar colunas

As cláusulas `CHANGE`, `MODIFY` e `ALTER` permitem que os nomes e definições das colunas existentes sejam alterados. Elas possuem essas características comparativas:

* `CHANGE`:

+ Pode renomear uma coluna e alterar sua definição, ou ambas.
+ Tem mais capacidade do que `MODIFY`, mas às custas da conveniência para algumas operações. `CHANGE` exige que o nome da coluna seja especificado duas vezes, se não for renomeado.

+ Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

* `MODIFY`:

+ Pode alterar a definição de uma coluna, mas não seu nome.
+ Mais conveniente do que `CHANGE` para alterar a definição de uma coluna sem renomeá-la.

+ Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

* `ALTER`: Usado apenas para alterar o valor padrão de uma coluna.

`CHANGE` é uma extensão do MySQL para SQL padrão. `MODIFY` é uma extensão do MySQL para compatibilidade com Oracle.

Para alterar uma coluna e alterar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigos e novos e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT`, mantendo o atributo `NOT NULL`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar a definição de uma coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe exige dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para não alterar o nome. Por exemplo, para alterar a definição da coluna `b`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` é mais conveniente para alterar a definição sem alterar o nome, pois requer o nome da coluna apenas uma vez:

```sql
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `CHANGE`. A sintaxe exige uma definição de coluna, portanto, para não alterar a definição, você deve redefinir a definição que a coluna tem atualmente. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

Para mudanças na definição de coluna usando `CHANGE` ou `MODIFY`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, exceto atributos de índice, como `PRIMARY KEY` ou `UNIQUE`. Os atributos presentes na definição original, mas não especificados para a nova definição, não são transportados. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` e você modifique a coluna da seguinte forma, com a intenção de alterar apenas `INT` para `BIGINT`:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa declaração muda o tipo de dados de `INT` para `BIGINT`, mas também exclui os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a declaração deve incluí-los explicitamente:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para mudanças de tipo de dados usando `CHANGE` ou `MODIFY`, o MySQL tenta converter os valores existentes das colunas para o novo tipo da melhor maneira possível.

Aviso

Essa conversão pode resultar em alteração dos dados. Por exemplo, se você encurtar uma coluna de cadeia, os valores podem ser truncados. Para evitar que a operação tenha sucesso se as conversões para o novo tipo de dados resultassem na perda de dados, habilite o modo SQL rigoroso antes de usar `ALTER TABLE` (consulte Seção 5.1.10, “Modos SQL do servidor”).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para colunas renomeadas por `CHANGE`, o MySQL renomeia automaticamente essas referências para a coluna renomeada:

* Índices que se referem à coluna antiga, incluindo índices e índices desativados `MyISAM`.

* Chaves estrangeiras que se referem à coluna antiga.

Para colunas renomeadas por `CHANGE`, o MySQL não renomeia automaticamente essas referências para a coluna renomeada:

* Expressões de coluna e partição geradas que se referem à coluna renomeada. Você deve usar `CHANGE` para redefinir tais expressões na mesma declaração `ALTER TABLE` que a que renomeia a coluna.

* Visões e programas armazenados que se referem à coluna renomeada. Você deve alterar manualmente a definição desses objetos para se referir ao novo nome da coluna.

Para reorganizar as colunas dentro de uma tabela, use `FIRST` e `AFTER` nas operações de `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especifica um novo valor padrão para uma coluna ou remove o valor padrão antigo, respectivamente. Se o valor antigo for removido e a coluna puder ser `NULL`, o novo valor padrão é `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor padrão conforme descrito na Seção 11.6, “Valores padrão de tipo de dados”.

`ALTER ... SET DEFAULT` não pode ser usado com a função `CURRENT_TIMESTAMP`.

#### Chaves Primárias e Índices

`DROP PRIMARY KEY` elimina a chave primária. Se não houver chave primária, ocorrerá um erro. Para informações sobre as características de desempenho das chaves primárias, especialmente para as tabelas `InnoDB`, consulte a Seção 8.3.2, “Otimização da Chave Primária”.

Se você adicionar um `UNIQUE INDEX` ou `PRIMARY KEY` a uma tabela, o MySQL armazena-o antes de qualquer índice não exclusivo para permitir a detecção de chaves duplicadas o mais cedo possível.

`DROP INDEX` remove um índice. Esta é uma extensão do MySQL para o SQL padrão. Veja a Seção 13.1.25, “Instrução DROP INDEX”. Para determinar os nomes dos índices, use `SHOW INDEX FROM tbl_name`.

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`. Para detalhes sobre `USING`, consulte a Seção 13.1.14, “Declaração CREATE INDEX”. A posição preferida é após a lista de colunas. Você deve esperar suporte para o uso da opção antes da lista de colunas ser removida em um lançamento futuro do MySQL.

Os valores de *`index_option`* especificam opções adicionais para um índice. Para obter detalhes sobre os valores *`index_option`* permitidos, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

`RENAME INDEX old_index_name TO new_index_name` renomeia um índice. Esta é uma extensão do MySQL ao SQL padrão. O conteúdo da tabela permanece inalterado. *`old_index_name`* deve ser o nome de um índice existente na tabela que não seja descartado pela mesma declaração `ALTER TABLE`. *`new_index_name`* é o novo nome do índice, que não pode duplicar o nome de um índice na tabela resultante após as alterações terem sido aplicadas. Nenhum nome de índice pode ser `PRIMARY`.

Se você usar `ALTER TABLE` em uma tabela `MyISAM`, todos os índices não exclusivos são criados em um lote separado (como no caso de `REPAIR TABLE`). Isso deve tornar `ALTER TABLE` muito mais rápido quando você tem muitos índices.

Para as tabelas `MyISAM`, a atualização de chaves pode ser controlada explicitamente. Use `ALTER TABLE ... DISABLE KEYS` para dizer ao MySQL para parar de atualizar índices não exclusivos. Em seguida, use `ALTER TABLE ... ENABLE KEYS` para recriar índices ausentes. `MyISAM` faz isso com um algoritmo especial que é muito mais rápido do que inserir chaves uma a uma, então desabilitar chaves antes de realizar operações de inserção em massa deve proporcionar um aumento considerável na velocidade. Usar `ALTER TABLE ... DISABLE KEYS` requer o privilégio `INDEX`, além dos privilégios mencionados anteriormente.

Embora os índices não exclusivos estejam desativados, eles são ignorados para declarações como `SELECT` e `EXPLAIN`, que, de outra forma, os utilizariam.

Após uma declaração `ALTER TABLE`, pode ser necessário executar `ANALYZE TABLE` para atualizar as informações de cardinalidade do índice. Veja a Seção 13.7.5.22, “Declaração SHOW INDEX”.

#### Chaves Estrangeiras e Outras Restrições

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos motores de armazenamento `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. Veja a Seção 1.6.3.2, “Restrições de CHAVE ESTÁVEL”. Para outros motores de armazenamento, as cláusulas são analisadas, mas ignoradas.

A cláusula de restrição `CHECK` é analisada, mas ignorada por todos os motores de armazenamento. Veja a Seção 13.1.18, “Instrução CREATE TABLE”. A razão para aceitar, mas ignorar cláusulas de sintaxe é por compatibilidade, para facilitar a transferência de código de outros servidores SQL e para executar aplicações que criam tabelas com referências. Veja a Seção 1.6.2, “Diferenças do MySQL em relação ao SQL Padrão”.

Para `ALTER TABLE`, ao contrário de `CREATE TABLE`, `ADD FOREIGN KEY` ignora *`index_name`* se fornecido e usa um nome de chave estrangeira gerado automaticamente. Como uma solução alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da chave estrangeira:

```sql
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações em string `REFERENCES`, onde as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas as cláusulas `REFERENCES` definidas como parte de uma especificação `FOREIGN KEY` separada.

Nota

As tabelas `InnoDB` particionadas não suportam chaves estrangeiras. Essa restrição não se aplica às tabelas `NDB`, incluindo aquelas explicitamente particionadas por `[LINEAR] KEY`. Para mais informações, consulte a Seção 22.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

O MySQL Server e o NDB Cluster ambos suportam o uso de `ALTER TABLE` para descartar chaves estrangeiras:

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

A adição e a remoção de uma chave estrangeira na mesma declaração `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`, mas não para `ALTER TABLE ... ALGORITHM=COPY`.

O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Uma solução é usar `ALTER TABLE ... DROP FOREIGN KEY` antes de alterar a definição da coluna e `ALTER TABLE ... ADD FOREIGN KEY` depois. Exemplos de alterações proibidas incluem:

* Alterações no tipo de dados das colunas de chave estrangeira que podem ser inseguras. Por exemplo, alterar `VARCHAR(20)` para `VARCHAR(30)` é permitido, mas alterá-lo para `VARCHAR(1024)` não é permitido, pois isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

* Alterar uma coluna `NULL` para `NOT NULL` em modo não estrito é proibido para evitar a conversão de valores `NULL` para valores não padrão não `NULL`, para os quais não existem valores correspondentes na tabela referenciada. A operação é permitida em modo estrito, mas um erro é retornado se qualquer conversão desse tipo for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera os nomes internos de restrições de chave estrangeira e os nomes de restrições de chave estrangeira definidos pelo usuário que começam com a string “*`tbl_name`*\_ibfk\_” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes de restrições de chave estrangeira que começam com a string “*`tbl_name`*\_ibfk\_” como nomes gerados internamente.

#### Alterando o Conjunto de Caracteres

Para alterar o conjunto de caracteres padrão da tabela e todas as colunas de caracteres (`CHAR`, `VARCHAR`, `TEXT`) para um novo conjunto de caracteres, use uma declaração como esta:

```sql
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A declaração também altera a correção de todos os campos de caracteres. Se você especificar nenhuma cláusula `COLLATE` para indicar qual correção usar, a declaração usa a correção padrão para o conjunto de caracteres. Se essa correção for inadequada para o uso pretendido da tabela (por exemplo, se ela mudaria de uma correção sensível ao caso para uma correção insensível ao caso), especifique uma correção explicitamente.

Para uma coluna que tem um tipo de dados de `VARCHAR` ou um dos tipos `TEXT`, `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna seja longa o suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna `TEXT` tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna `latin1` `TEXT`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8`, cada caractere pode requerer até três bytes, para um comprimento possível máximo de 3 × 65.535 = 196.605 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna `TEXT`, então o MySQL converte o tipo de dados para `MEDIUMTEXT`, que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 196.605. Da mesma forma, uma coluna `VARCHAR` pode ser convertida para `MEDIUMTEXT`.

Para evitar mudanças no tipo de dados do tipo descrito acima, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```sql
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas `CHAR`, `VARCHAR` e `TEXT` são convertidas para seus tipos correspondentes de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Isso significa que as colunas não têm mais um conjunto de caracteres e uma operação subsequente `CONVERT TO` não se aplica a elas.

Se *`charset_name`* for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema `character_set_database` é usado.

Aviso

A operação `CONVERT TO` converte os valores das colunas entre os conjuntos de caracteres originais e nomeados. Isso *não* é o que você deseja se tiver uma coluna em um conjunto de caracteres (como `latin1`) mas os valores armazenados utilizam, na verdade, algum outro conjunto de caracteres incompatível (como `utf8`). Neste caso, você tem que fazer o seguinte para cada coluna desse tipo:

```sql
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou a partir das colunas `BLOB`.

Para alterar apenas o conjunto de caracteres *padrão* de uma tabela, use esta declaração:

```sql
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres padrão é o conjunto de caracteres que é usado se você não especificar o conjunto de caracteres para as colunas que você adicionar a uma tabela posteriormente (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema `foreign_key_checks` é habilitada, que é a configuração padrão, a conversão de conjuntos de caracteres não é permitida em tabelas que incluem uma coluna de cadeia de caracteres usada em uma restrição de chave estrangeira. A solução é desabilitar `foreign_key_checks` antes de realizar a conversão de conjuntos de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na restrição de chave estrangeira antes de reativar `foreign_key_checks`. Se você reativar `foreign_key_checks` após converter apenas uma das tabelas, uma operação `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper os dados na tabela de referência devido à conversão implícita que ocorre durante essas operações (Bug #45290, Bug #74816).

#### Descartar e importar espaços de tabela InnoDB

Uma tabela `InnoDB` criada em seu próprio espaço de tabelas por arquivo pode ser importada a partir de um backup ou de outra instância do servidor MySQL usando as cláusulas `DISCARD TABLEPACE` e `IMPORT TABLESPACE`. Veja a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

#### Ordem de string para tabelas MyISAM

`ORDER BY` permite que você crie a nova tabela com as strings em um determinado ordem. Esta opção é útil principalmente quando você sabe que consulta as strings em um determinado ordem a maior parte do tempo. Ao usar esta opção após alterações importantes na tabela, você pode conseguir um desempenho mais alto. Em alguns casos, isso pode tornar o ordenamento mais fácil para o MySQL se a tabela estiver em ordem pela coluna pela qual você deseja ordená-la mais tarde.

Nota

A tabela não permanece na ordem especificada após inserções e excluções.

A sintaxe `ORDER BY` permite que um ou mais nomes de coluna sejam especificados para ordenação, sendo que cada um deles, opcionalmente, pode ser seguido por `ASC` ou `DESC` para indicar a ordem de classificação ascendente ou descendente, respectivamente. O padrão é a ordem ascendente. Apenas nomes de coluna são permitidos como critérios de ordenação; expressões arbitrárias não são permitidas. Esta cláusula deve ser dada por último após qualquer outra cláusula.

`ORDER BY` não faz sentido para as tabelas `InnoDB`, porque `InnoDB` sempre ordena as strings da tabela de acordo com o índice agrupado.

Quando usado em uma tabela dividida, `ALTER TABLE ... ORDER BY` ordena as strings apenas dentro de cada divisão.

#### Opções de Partição

*`partition_options`* indica opções que podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, mesclar e dividir particionamentos, além de realizar manutenção de particionamento.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após qualquer outra especificação. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, uma vez que as opções listadas acima atuam em partições individuais.

Para mais informações sobre as opções de partição, consulte a Seção 13.1.18, “Instrução CREATE TABLE”, e a Seção 13.1.8.1, “Operações de Partição ALTER TABLE”. Para informações e exemplos sobre as instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte a Seção 22.3.3, “Trocando Partições e Subpartições com Tabelas”.

Antes do MySQL 5.7.6, as tabelas `InnoDB` particionadas usavam o manipulador de particionamento genérico `ha_partition` empregado pelo `MyISAM` e outros motores de armazenamento que não fornecem seus próprios manipuladores de particionamento; no MySQL 5.7.6 e versões posteriores, essas tabelas são criadas usando o próprio manipulador de particionamento (ou “nativo”) do motor de armazenamento `InnoDB`. A partir do MySQL 5.7.9, você pode atualizar uma tabela `InnoDB` que foi criada no MySQL 5.7.6 ou versões anteriores (ou seja, criada usando `ha_partition`) para o manipulador de particionamento nativo `InnoDB` usando `ALTER TABLE ... UPGRADE PARTITIONING`. (Bug #76734, Bug #20727344) Essa sintaxe `ALTER TABLE` não aceita outras opções e pode ser usada apenas em uma única tabela de cada vez. Você também pode usar `mysqld_upgrade` no MySQL 5.7.9 ou versões posteriores para atualizar tabelas **InnoDB** particionadas mais antigas para o manipulador de particionamento nativo.

#### 13.1.8.1 Operações de Partição em Tabela ALTER

As cláusulas relacionadas à partição para `ALTER TABLE` podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, combinar e dividir partições, além de realizar manutenção de partição.

* Simplesmente usando uma cláusula *`partition_options`* com `ALTER TABLE` em uma tabela particionada, a tabela é dividida de acordo com o esquema de particionamento definido por *`partition_options`*. Esta cláusula sempre começa com `PARTITION BY`, e segue a mesma sintaxe e outras regras que se aplicam à cláusula *`partition_options`* para `CREATE TABLE` (para informações mais detalhadas, consulte Seção 13.1.18, “Declaração CREATE TABLE”), e também pode ser usada para particionar uma tabela existente que não esteja já particionada. Por exemplo, considere uma tabela (não particionada) definida como mostrado aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

Essa tabela pode ser particionada por `HASH`, usando a coluna `id` como chave de particionamento, em 8 partições por meio desta declaração:

  ```sql
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

O MySQL suporta a opção `ALGORITHM` com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chave que o MySQL 5.1 ao calcular a colocação de strings em partições; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chave implementadas e usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.5 e versões posteriores. (Tabelas particionadas criadas com as funções de hashing de chave empregadas no MySQL 5.5 e versões posteriores não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada ao uso principalmente ao atualizar ou desatualizar tabelas particionadas `[LINEAR] KEY` entre as versões MySQL 5.1 e posteriores, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1.

Para atualizar uma tabela particionada `KEY` que foi criada no MySQL 5.1, execute primeiro `SHOW CREATE TABLE` e anote as colunas exatas e o número de particionamentos mostrados. Agora, execute uma declaração `ALTER TABLE` usando exatamente a mesma lista de colunas e número de particionamentos que na declaração `CREATE TABLE`, enquanto adiciona `ALGORITHM=2` imediatamente após as palavras-chave `PARTITION BY`. (Você também deve incluir a palavra-chave `LINEAR` se ela foi usada para a definição original da tabela.) Um exemplo de uma sessão no cliente **mysql** é mostrado aqui:

  ```sql
  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)

  mysql> ALTER TABLE p PARTITION BY LINEAR KEY ALGORITHM=2 (id) PARTITIONS 32;
  Query OK, 0 rows affected (5.34 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)
  ```

Para desfazer a classificação de uma tabela criada usando a chave de hashing padrão usada no MySQL 5.5 e versões posteriores, para permitir que um servidor MySQL 5.1 a use, é semelhante, exceto que, neste caso, você deve usar `ALGORITHM=1` para forçar a reconstrução das partições da tabela usando as funções de hashing de chave do MySQL 5.1. É recomendado que você não faça isso, exceto quando necessário para compatibilidade com um servidor MySQL 5.1, pois as funções de hashing de melhor desempenho `KEY` usadas por padrão no MySQL 5.5 e versões posteriores fornecem correções para vários problemas encontrados na implementação mais antiga.

Nota

Uma tabela atualizada por meio de `ALTER TABLE ... PARTITION BY ALGORITHM=2 [LINEAR] KEY ...` não pode mais ser usada por um servidor MySQL 5.1. (Tal tabela precisaria ser desvalorizada com `ALTER TABLE ... PARTITION BY ALGORITHM=1 [LINEAR] KEY ...` antes de poder ser usada novamente por um servidor MySQL 5.1.)

A tabela que resulta do uso de uma declaração `ALTER TABLE ... PARTITION BY` deve seguir as mesmas regras que uma criada usando `CREATE TABLE ... PARTITION BY`. Isso inclui as regras que regem a relação entre quaisquer chaves únicas (incluindo qualquer chave primária) que a tabela possa ter, e as colunas ou colunas usadas na expressão de particionamento, conforme discutido na Seção 22.6.1, "Chaves de particionamento, chaves primárias e chaves únicas". As regras `CREATE TABLE ... PARTITION BY` para especificar o número de particionamentos também se aplicam a `ALTER TABLE ... PARTITION BY`.

A cláusula *`partition_definition`* para `ALTER TABLE ADD PARTITION` suporta as mesmas opções que a cláusula do mesmo nome para a declaração `CREATE TABLE`. (Veja a Seção 13.1.18, “Declaração CREATE TABLE”, para a sintaxe e descrição.) Suponha que você tenha a tabela particionada criada como mostrado aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

Você pode adicionar uma nova partição `p3` a esta tabela para armazenar valores menores que `2002` da seguinte forma:

  ```sql
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

`DROP PARTITION` pode ser usado para descartar uma ou mais partições `RANGE` ou `LIST`. Esta declaração não pode ser usada com as partições `HASH` ou `KEY`; em vez disso, use `COALESCE PARTITION` (consulte abaixo). Quaisquer dados que foram armazenados nas partições descartadas, nomeadas na lista *`partition_names`*, são descartados. Por exemplo, dado o quadro `t1` definido anteriormente, você pode descartar as partições nomeadas `p0` e `p1` como mostrado aqui:

  ```sql
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

Nota

`DROP PARTITION` não funciona com tabelas que utilizam o mecanismo de armazenamento `NDB`. Consulte a Seção 22.3.1, “Gestão de Partições RANGE e LIST”, e a Seção 21.2.7, “Limitações Conhecidas do NDB Cluster”.

`ADD PARTITION` e `DROP PARTITION` não suportam atualmente `IF [NOT] EXISTS`.

As opções `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` estendem o recurso de Espaço de Tabela Transportador a partições individuais de tabela `InnoDB`. Cada partição de tabela `InnoDB` tem seu próprio arquivo de espaço de tabela (arquivo `.ibd`). O recurso de Espaço de Tabela Transportador facilita a cópia dos espaços de tabela de uma instância de servidor MySQL em execução para outra instância em execução, ou para realizar uma restauração na mesma instância. Ambas as opções aceitam uma lista de um ou mais nomes de partição separados por vírgula. Por exemplo:

  ```sql
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```sql
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

Ao executar `DISCARD PARTITION ... TABLESPACE` e `IMPORT PARTITION ... TABLESPACE` em tabelas subpartidas, tanto os nomes de partição quanto os de subpartição são permitidos. Quando um nome de partição é especificado, as subpartições dessa partição são incluídas.

O recurso Transportable Tablespace também suporta a cópia ou restauração de tabelas particionadas `InnoDB`. Para mais informações, consulte a Seção 14.6.1.3, “Importando tabelas InnoDB”.

Os nomes renomeados de tabelas particionadas são suportados. Você pode renomear diretamente as partições individuais usando `ALTER TABLE ... REORGANIZE PARTITION`; no entanto, essa operação copia os dados da partição.

Para excluir strings de partições selecionadas, use a opção `TRUNCATE PARTITION`. Esta opção recebe uma lista de nomes de partição separados por vírgula de uma ou mais partições. Por exemplo, considere a tabela `t1` conforme definida aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

Para excluir todas as strings da partição `p0`, use a seguinte declaração:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

A declaração que acabou de ser mostrada tem o mesmo efeito que a seguinte declaração `DELETE`:

  ```sql
  DELETE FROM t1 WHERE year_col < 1991;
  ```

Ao truncar múltiplas partições, as partições não precisam ser contínuas: Isso pode simplificar muito as operações de exclusão em tabelas particionadas que, de outra forma, exigiriam condições muito complexas `WHERE` se feitas com declarações `DELETE`. Por exemplo, esta declaração exclui todas as strings das partições `p1` e `p3`:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

Aqui está uma declaração equivalente `DELETE`:

  ```sql
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

Se você usar a palavra-chave `ALL` no lugar da lista de nomes de partição, a declaração atua em todas as partições da tabela.

`TRUNCATE PARTITION` apenas exclui strings; não altera a definição da própria tabela ou de qualquer uma de suas partições.

Para verificar se as strings foram excluídas, verifique a tabela `INFORMATION_SCHEMA.PARTITIONS`, usando uma consulta como esta:

  ```sql
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

`TRUNCATE PARTITION` é suportado apenas para tabelas particionadas que utilizam o mecanismo de armazenamento `MyISAM`, `InnoDB` ou `MEMORY`. Também funciona em tabelas `BLACKHOLE` (mas não tem efeito). Não é suportado para tabelas `ARCHIVE`.

`COALESCE PARTITION` pode ser usado com uma tabela que é particionada por `HASH` ou `KEY` para reduzir o número de particionamentos por *`number`*. Suponha que você tenha criado a tabela `t2` da seguinte forma:

  ```sql
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

Para reduzir o número de partições utilizadas pelo `t2` de 6 para 4, use a seguinte declaração:

  ```sql
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

Os dados contidos nas últimas partições *`number`* são agregados às partições restantes. Neste caso, as partições 4 e 5 são agregadas às primeiras 4 partições (as partições numeradas 0, 1, 2 e 3).

Para alterar algumas, mas não todas, as partições usadas por uma tabela particionada, você pode usar `REORGANIZE PARTITION`. Essa declaração pode ser usada de várias maneiras:

+ Para fundir um conjunto de partições em uma única partição. Isso é feito ao nomear várias partições na lista *`partition_names`* e fornecendo uma única definição para *`partition_definition`*.

+ Para dividir uma partição existente em várias partições. Para isso, dê um nome a uma única partição para *`partition_names`* e forneça várias *`partition_definitions`*.

+ Para alterar os intervalos para um subconjunto de partições definidas usando `VALUES LESS THAN` ou as listas de valores para um subconjunto de partições definidas usando `VALUES IN`.

+ Esta declaração também pode ser usada sem a opção `partition_names INTO (partition_definitions)` em tabelas que são automaticamente particionadas usando a particionamento `HASH` para forçar a redistribuição de dados. (Atualmente, apenas as tabelas `NDB` são automaticamente particionadas dessa maneira.) Isso é útil no NDB Cluster, onde, após ter adicionado novos nós de dados do NDB Cluster online a um NDB Cluster existente, você deseja redistribuir os dados de tabela do NDB Cluster existente para os novos nós de dados. Nesses casos, você deve invocar a declaração com a opção `ALGORITHM=INPLACE`; em outras palavras, como mostrado aqui:

    ```sql
    ALTER TABLE table ALGORITHM=INPLACE, REORGANIZE PARTITION;
    ```

Você não pode executar outras DDL simultaneamente com a reorganização de tabela online — ou seja, não podem ser emitidas outras declarações de DDL enquanto uma declaração `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` está sendo executada. Para mais informações sobre como adicionar nós de dados do NDB Cluster online, consulte a Seção 21.6.7, “Adicionar nós de dados do NDB Cluster online”.

Nota

`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona com tabelas que foram criadas usando a opção `MAX_ROWS`, porque ele usa o valor constante `MAX_ROWS` especificado na declaração original `CREATE TABLE` para determinar o número de partições necessárias, então não são criadas novas partições. Em vez disso, você pode usar `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=rows` para aumentar o número máximo de strings para uma tabela desse tipo; nesse caso, `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não é necessário (e causa um erro se executado). O valor de *`rows`* deve ser maior que o valor especificado para `MAX_ROWS` na declaração original `CREATE TABLE` para que isso funcione.

Empregar `MAX_ROWS` para forçar o número de partições de tabela é desaconselhável no NDB 7.5.4 e versões posteriores; use `PARTITION_BALANCE` em vez disso (consulte Configuração das opções NDB_TABLE).

Tentar usar `REORGANIZE PARTITION` sem a opção `partition_names INTO (partition_definitions)` em tabelas explicitamente particionadas resulta no erro REORGANIZE PARTITION sem parâmetros, que só pode ser usado em tabelas com particionamento automático usando particionamento HASH.

Nota

Para partições que não foram explicitamente nomeadas, o MySQL fornece automaticamente os nomes padrão `p0`, `p1`, `p2`, e assim por diante. O mesmo vale para as subpartições.

Para informações mais detalhadas sobre as declarações `ALTER TABLE ... REORGANIZE PARTITION` e exemplos, consulte a Seção 22.3.1, “Gestão de Partições RANGE e LIST”.

* Para trocar uma partição ou subpartição de uma tabela com uma tabela, use a declaração `ALTER TABLE ... EXCHANGE PARTITION` — ou seja, para mover quaisquer strings existentes na partição ou subpartição para a tabela não particionada e quaisquer strings existentes na tabela não particionada para a partição ou subpartição da tabela.

Para informações de uso e exemplos, consulte a Seção 22.3.3, “Trocando Partições e Subpartições com Tabelas”.

* Várias opções oferecem manutenção e reparo de partições análoga à implementada para tabelas não particionadas por declarações como `CHECK TABLE` e `REPAIR TABLE` (que também são suportadas para tabelas particionadas; para mais informações, consulte Seção 13.7.2, “Declarações de Manutenção de Tabelas”). Essas incluem `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION` e `REPAIR PARTITION`. Cada uma dessas opções leva uma cláusula *`partition_names`* composta por um ou mais nomes de partições, separados por vírgulas. As partições devem já existir na tabela que será alterada. Você também pode usar a palavra-chave `ALL` no lugar de *`partition_names`*, no caso, a declaração atua em todas as partições da tabela. Para mais informações e exemplos, consulte Seção 22.3.4, “Manutenção de Partições”.

Alguns motores de armazenamento do MySQL, como `InnoDB`, não suportam otimização por partição. Para uma tabela particionada que utiliza um motor de armazenamento desse tipo, `ALTER TABLE ... OPTIMIZE PARTITION` faz com que toda a tabela seja reconstruída e analisada, e um aviso apropriado é emitido. (Bug #11751825, Bug #42822)

Para contornar esse problema, use as declarações `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso.

As opções `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION` e `REPAIR PARTITION` não são permitidas para tabelas que não estão particionadas.

* No MySQL 5.7.9 e versões posteriores, você pode usar `ALTER TABLE ... UPGRADE PARTITIONING` para atualizar uma tabela `InnoDB` particionada que foi criada com o antigo manipulador de particionamento genérico para o particionamento nativo `InnoDB` empregado no MySQL 5.7.6 e versões posteriores. Além disso, a partir do MySQL 5.7.9, a ferramenta `mysqld_upgrade` verifica tais tabelas `InnoDB` particionadas e tenta atualizá-las para o particionamento nativo como parte de suas operações normais.

Importante

As tabelas particionadas `InnoDB` que não utilizam o manipulador de particionamento nativo `InnoDB` não podem ser usadas no MySQL 8.0 ou posterior. `ALTER TABLE ... UPGRADE PARTITIONING` não é suportado no MySQL 8.0 ou posterior; portanto, quaisquer tabelas particionadas `InnoDB` que utilizem o manipulador genérico *devem* ser atualizadas para o manipulador nativo InnoDB *antes* de atualizar sua instalação do MySQL para o MySQL 8.0 ou posterior.

* `REMOVE PARTITIONING` permite que você remova a partição de uma tabela sem afetar a tabela ou seus dados de outra forma. Esta opção pode ser combinada com outras opções `ALTER TABLE` como as usadas para adicionar, remover ou renomear colunas ou índices.

* O uso da opção `ENGINE` com `ALTER TABLE` altera o mecanismo de armazenamento utilizado pela tabela sem afetar a partição.

Quando o `ALTER TABLE ... EXCHANGE PARTITION` ou o `ALTER TABLE ... TRUNCATE PARTITION` é executado em uma tabela particionada que utiliza `MyISAM` (ou outro mecanismo de armazenamento que faz uso de bloqueio em nível de tabela), apenas as partições que são realmente lidas são bloqueadas. (Isso não se aplica a tabelas particionadas que utilizam um mecanismo de armazenamento que emprega bloqueio em nível de string, como o `InnoDB`). Veja a Seção 22.6.4, “Particionamento e Bloqueio”.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após quaisquer outras especificações.

As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais. Para mais informações, consulte a Seção 13.1.8.1, “Operações de Partição de ALTER TABLE”.

Apenas uma única instância de qualquer uma das seguintes opções pode ser usada em uma declaração específica do `ALTER TABLE`: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

Por exemplo, as seguintes duas afirmações são inválidas:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

No primeiro caso, você pode analisar as partições `p1` e `p2` da tabela `t1` simultaneamente usando uma única declaração com uma única opção `ANALYZE PARTITION` que lista ambas as partições a serem analisadas, como este:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

No segundo caso, não é possível realizar as operações `ANALYZE` e `CHECK` em diferentes partições da mesma tabela simultaneamente. Em vez disso, você deve emitir duas declarações separadas, como esta:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

As operações `REBUILD` não são suportadas atualmente para subpartições. A palavra-chave `REBUILD` é expressamente proibida com subpartições e faz com que `ALTER TABLE` falhe com um erro se assim for usada.

As operações `CHECK PARTITION` e `REPAIR PARTITION` falham quando a partição a ser verificada ou reparada contém quaisquer erros de chave duplicada.

Para mais informações sobre essas declarações, consulte a Seção 22.3.4, “Manutenção de Partições”.

#### 13.1.8.2 ALTER TABLE e Colunas Geradas

As operações permitidas para colunas geradas são `ADD`, `MODIFY` e `CHANGE`.

* Colunas geradas podem ser adicionadas.

  ```sql
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* O tipo de dados e a expressão das colunas geradas podem ser modificados.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* As colunas geradas podem ser renomeadas ou excluídas, desde que nenhuma outra coluna as refira.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* As colunas geradas virtualmente não podem ser alteradas para colunas geradas armazenadas, ou vice-versa. Para contornar isso, descarte a coluna e, em seguida, adicione-a com a nova definição.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas não geradas podem ser alteradas para armazenadas, mas não para colunas geradas virtualmente.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Colunas armazenadas, mas não geradas virtualmente, podem ser alteradas para colunas não geradas. Os valores gerados armazenados se tornam os valores da coluna não gerada.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor. Para colunas armazenadas, as alterações de indexação são feitas in-place, e as alterações de expressão não são feitas in-place. As alterações nos comentários das colunas são feitas in-place.

* Para tabelas não particionadas, `ADD COLUMN` e `DROP COLUMN` são operações in-place para colunas virtuais. No entanto, não é possível adicionar ou excluir uma coluna virtual in-place em combinação com outras operações `ALTER TABLE`.

Para tabelas particionadas, `ADD COLUMN` e `DROP COLUMN` não são operações in-place para colunas virtuais.

* `InnoDB` suporta índices secundários em colunas geradas virtualmente. Adicionar ou remover um índice secundário em uma coluna gerada virtualmente é uma operação in-place. Para mais informações, consulte a Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

* Quando uma coluna gerada por `VIRTUAL` é adicionada a uma tabela ou modificada, não se garante que os valores calculados pela expressão da coluna gerada não estejam fora do intervalo da coluna. Isso pode levar ao retorno de dados inconsistentes e a declarações falhando inesperadamente. Para permitir o controle sobre se a validação ocorre para tais colunas, o `ALTER TABLE` suporta as cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION`:

+ Com `WITHOUT VALIDATION` (o padrão se nenhuma das cláusulas for especificada), uma operação in-place é realizada (se possível), a integridade dos dados não é verificada e a declaração termina mais rapidamente. No entanto, leituras posteriores da tabela podem relatar avisos ou erros para a coluna se os valores estiverem fora do intervalo.

+ Com `WITH VALIDATION`, `ALTER TABLE` copia a tabela. Se ocorrer uma saída de faixa ou qualquer outro erro, a declaração falha. Como uma cópia da tabela é realizada, a declaração leva mais tempo.

`WITHOUT VALIDATION` e `WITH VALIDATION` são permitidos apenas com `ADD COLUMN`, `CHANGE COLUMN` e `MODIFY COLUMN` operações. Caso contrário, ocorre um erro `ER_WRONG_USAGE`.

* a partir do MySQL 5.7.10, se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a declaração `ALTER TABLE` termina com um erro e a operação DDL é rejeitada.

* Uma declaração `ALTER TABLE` que altera o valor padrão de uma coluna *`col_name`* também pode alterar o valor de uma expressão de coluna gerada que se refere à coluna usando `DEFAULT(col_name)`. Por essa razão, a partir do MySQL 5.7.13, as operações `ALTER TABLE` que alteram a definição de uma coluna causam uma reconstrução da tabela se alguma expressão de coluna gerada usar `DEFAULT()`.

#### 13.1.8.3 Exemplos de ALTER TABLE

Comece com uma tabela `t1` criada conforme mostrado aqui:

```sql
CREATE TABLE t1 (a INTEGER, b CHAR(10));
```

Para renomear a tabela de `t1` para `t2`:

```sql
ALTER TABLE t1 RENAME t2;
```

Para alterar a coluna `a` de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) para `TINYINT NOT NULL` (mantendo o mesmo nome), e para alterar a coluna `b` de `CHAR(10)` para `CHAR(20)`, além de renomeá-la de `b` para `c`:

```sql
ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b c CHAR(20);
```

Para adicionar uma nova coluna `TIMESTAMP` chamada `d`:

```sql
ALTER TABLE t2 ADD d TIMESTAMP;
```

Para adicionar um índice na coluna `d` e um índice `UNIQUE` na coluna `a`:

```sql
ALTER TABLE t2 ADD INDEX (d), ADD UNIQUE (a);
```

Para remover a coluna `c`:

```sql
ALTER TABLE t2 DROP COLUMN c;
```

Para adicionar uma nova coluna inteira `AUTO_INCREMENT` com o nome `c`:

```sql
ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (c);
```

Indexamos `c` (como `PRIMARY KEY`) porque as colunas `AUTO_INCREMENT` devem ser indexadas, e declaramos `c` como `NOT NULL` porque as colunas da chave primária não podem ser `NULL`.

Para as tabelas `NDB`, também é possível alterar o tipo de armazenamento usado para uma tabela ou coluna. Por exemplo, considere uma tabela `NDB` criada conforme mostrado aqui:

```sql
mysql> CREATE TABLE t1 (c1 INT) TABLESPACE ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.27 sec)
```

Para converter esta tabela para armazenamento baseado em disco, você pode usar a seguinte declaração `ALTER TABLE`:

```sql
mysql> ALTER TABLE t1 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.01 sec)
```

Não é necessário que o tablespace tenha sido referenciado quando a tabela foi originalmente criada; no entanto, o tablespace deve ser referenciado pelo `ALTER TABLE`:

```sql
mysql> CREATE TABLE t2 (c1 INT) ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.00 sec)

mysql> ALTER TABLE t2 STORAGE DISK;
ERROR 1005 (HY000): Can't create table 'c.#sql-1750_3' (errno: 140)
mysql> ALTER TABLE t2 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (3.42 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t2` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.01 sec)
```

Para alterar o tipo de armazenamento de uma coluna individual, você pode usar `ALTER TABLE ... MODIFY [COLUMN]`. Por exemplo, suponha que você crie uma tabela de dados de disco de NDB Cluster com duas colunas, usando esta declaração `CREATE TABLE`:

```sql
mysql> CREATE TABLE t3 (c1 INT, c2 INT)
    ->     TABLESPACE ts_1 STORAGE DISK ENGINE NDB;
Query OK, 0 rows affected (1.34 sec)
```

Para alterar a coluna `c2` de armazenamento baseado em disco para armazenamento em memória, inclua uma cláusula de MEMÓRIA DE ARQUIVO na definição da coluna usada pelo comando ALTER TABLE, conforme mostrado aqui:

```sql
mysql> ALTER TABLE t3 MODIFY c2 INT STORAGE MEMORY;
Query OK, 0 rows affected (3.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode transformar uma coluna de memória em uma coluna baseada em disco usando `STORAGE DISK` de uma maneira semelhante.

A coluna `c1` utiliza armazenamento baseado em disco, uma vez que essa é a opção padrão para a tabela (determinada pela cláusula de nível de tabela `STORAGE DISK` na declaração `CREATE TABLE`). No entanto, a coluna `c2` utiliza armazenamento em memória, como pode ser visto aqui na saída do comando SHOW `CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) /*!50120 STORAGE MEMORY */ DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.02 sec)
```

Quando você adiciona uma coluna `AUTO_INCREMENT`, os valores da coluna são preenchidos automaticamente com números de sequência. Para as tabelas `MyISAM`, você pode definir o primeiro número de sequência executando `SET INSERT_ID=value` antes de `ALTER TABLE` ou usando a opção da tabela `AUTO_INCREMENT=value`.

Com as tabelas `MyISAM`, se você não alterar a coluna `AUTO_INCREMENT`, o número de sequência não será afetado. Se você excluir uma coluna `AUTO_INCREMENT` e, em seguida, adicionar outra coluna `AUTO_INCREMENT`, os números serão resequenciados, começando com o número 1.

Quando a replicação é usada, adicionar uma coluna `AUTO_INCREMENT` a uma tabela pode não produzir a mesma ordem das strings na replica e na fonte. Isso ocorre porque a ordem em que as strings são numeradas depende do motor de armazenamento específico usado para a tabela e da ordem em que as strings foram inseridas. Se é importante ter a mesma ordem na fonte e na replica, as strings devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Supondo que você queira adicionar uma coluna `AUTO_INCREMENT` à tabela `t1`, as seguintes declarações produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

```sql
CREATE TABLE t2 (id INT AUTO_INCREMENT PRIMARY KEY)
SELECT * FROM t1 ORDER BY col1, col2;
```

Isso pressupõe que a tabela `t1` tenha as colunas `col1` e `col2`.

Este conjunto de declarações também produz uma nova tabela `t2` idêntica a `t1`, com a adição de uma coluna `AUTO_INCREMENT`:

```sql
CREATE TABLE t2 LIKE t1;
ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
```

Importante

Para garantir a mesma ordem tanto na fonte quanto na replica, *todas as* colunas de `t1` devem ser referenciadas na cláusula `ORDER BY`.

Independentemente do método usado para criar e povoar a cópia com a coluna `AUTO_INCREMENT`, a etapa final é descartar a tabela original e, em seguida, renomear a cópia:

```sql
DROP TABLE t1;
ALTER TABLE t2 RENAME t1;
```

### 13.1.9 Declaração ALTER TABLESPACE

```sql
ALTER TABLESPACE tablespace_name
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

Essa declaração é usada para adicionar um novo arquivo de dados ou para descartar um arquivo de dados de um espaço de tabelas.

A variante `ADD DATAFILE` permite especificar um tamanho inicial usando uma cláusula `INITIAL_SIZE`, onde *`size`* é medido em bytes; o valor padrão é 134217728 (128 MB). Opcionalmente, você pode seguir *`size`* com uma abreviação de uma ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (megabytes) ou `G` (gigabytes).

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um arquivo de dados com o mesmo nome, ou um arquivo de log de desfazer e um espaço de tabelas com o mesmo nome.

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` é arredondado, explicitamente, como para `CREATE TABLESPACE`.

Uma vez que um arquivo de dados tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao espaço de tabelas usando declarações adicionais de `ALTER TABLESPACE ... ADD DATAFILE`.

Usando `DROP DATAFILE` com `ALTER TABLESPACE`, o arquivo de dados '*`file_name`*' é excluído do espaço de tabelas. Não é possível excluir um arquivo de dados de um espaço de tabelas que esteja sendo usado por qualquer tabela; em outras palavras, o arquivo de dados deve estar vazio (sem extensões utilizadas). Veja a Seção 21.6.11.1, “Objetos de dados de disco de cluster NDB”. Além disso, qualquer arquivo de dados que será excluído deve ter sido previamente adicionado ao espaço de tabelas com `CREATE TABLESPACE` ou `ALTER TABLESPACE`.

Tanto `ALTER TABLESPACE ... ADD DATAFILE` quanto `ALTER TABLESPACE ... DROP DATAFILE` exigem uma cláusula `ENGINE` que especifica o mecanismo de armazenamento utilizado pelo tablespace. Atualmente, os únicos valores aceitos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`WAIT` é analisado, mas ignorado, e, portanto, não tem efeito no MySQL 5.7. É destinado para expansão futura.

Quando o `ALTER TABLESPACE ... ADD DATAFILE` é usado com o `ENGINE = NDB`, um arquivo de dados é criado em cada nó de dados do Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles, realizando uma consulta à tabela do Esquema de Informações `FILES`. Por exemplo, a seguinte consulta mostra todos os arquivos de dados pertencentes ao espaço de tabelas denominado `newts`:

```sql
mysql> SELECT LOGFILE_GROUP_NAME, FILE_NAME, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE TABLESPACE_NAME = 'newts' AND FILE_TYPE = 'DATAFILE';
+--------------------+--------------+----------------+
| LOGFILE_GROUP_NAME | FILE_NAME    | EXTRA          |
+--------------------+--------------+----------------+
| lg_3               | newdata.dat  | CLUSTER_NODE=3 |
| lg_3               | newdata.dat  | CLUSTER_NODE=4 |
| lg_3               | newdata2.dat | CLUSTER_NODE=3 |
| lg_3               | newdata2.dat | CLUSTER_NODE=4 |
+--------------------+--------------+----------------+
2 rows in set (0.03 sec)
```

Veja a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”.

`ALTER TABLESPACE` é útil apenas com armazenamento de dados de disco para NDB Cluster. Veja a Seção 21.6.11, “Tabelas de dados de disco do NDB Cluster”.

### 13.1.10 Declaração de ALTER VIEW

```sql
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

Essa declaração altera a definição de uma visão, que deve existir. A sintaxe é semelhante àquela para `CREATE VIEW`, veja Seção 13.1.21, “Declaração CREATE VIEW”). Essa declaração requer os privilégios `CREATE VIEW` e `DROP` para a visão, e alguns privilégios para cada coluna referenciada na declaração `SELECT`. `ALTER VIEW` é permitido apenas ao definidor ou usuários com o privilégio `SUPER`.

### 13.1.11 Declaração CREATE DATABASE

```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
}
```

`CREATE DATABASE` cria um banco de dados com o nome fornecido. Para usar esta declaração, você precisa do privilégio `CREATE` para o banco de dados. `CREATE SCHEMA` é sinônimo de `CREATE DATABASE`.

Um erro ocorre se o banco de dados existir e você não especificar `IF NOT EXISTS`.

`CREATE DATABASE` não é permitido em uma sessão que tenha uma declaração ativa `LOCK TABLES`.

Cada *`create_option` especifica uma característica do banco de dados. As características do banco de dados são armazenadas no arquivo `db.opt` no diretório do banco de dados. A opção `CHARACTER SET` especifica o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` especifica a agregação de dados padrão do banco de dados. Para informações sobre os nomes dos conjuntos de caracteres e da agregação, consulte o Capítulo 10, *Sistemas de caracteres, colatões, Unicode*.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 13.7.5.3, “Declaração SHOW CHARACTER SET”, e a Seção 13.7.5.4, “Declaração SHOW COLLATION”.

Um banco de dados no MySQL é implementado como um diretório que contém arquivos que correspondem a tabelas no banco de dados. Como não há tabelas em um banco de dados quando ele é criado inicialmente, a declaração `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL e o arquivo `db.opt`. As regras para nomes de banco de dados permitidos são dadas na Seção 9.2, “Nomes de Objetos do Esquema”. Se um nome de banco de dados contiver caracteres especiais, o nome do diretório do banco de dados contém versões codificadas desses caracteres, conforme descrito na Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.

Se você criar manualmente um diretório sob o diretório de dados (por exemplo, com **mkdir**), o servidor o considera um diretório de banco de dados e ele aparece na saída de `SHOW DATABASES`.

Quando você criar um banco de dados, deixe o servidor gerenciar o diretório e os arquivos nele. Manipular diretórios e arquivos de banco de dados diretamente pode causar inconsistências e resultados inesperados.

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

Você também pode usar o programa **mysqladmin** para criar bancos de dados. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

### 13.1.12 Declaração de criação de evento

```sql
CREATE
    [DEFINER = user]
    EVENT
    [IF NOT EXISTS]
    event_name
    ON SCHEDULE schedule
    [ON COMPLETION [NOT] PRESERVE]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    DO event_body;

schedule: {
    AT timestamp [+ INTERVAL interval] ...
  | EVERY interval
    [STARTS timestamp [+ INTERVAL interval] ...]
    [ENDS timestamp [+ INTERVAL interval] ...]
}

interval:
    quantity {YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |
              WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE |
              DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND}
```

Essa declaração cria e agrupa um novo evento. O evento não é executado a menos que o Agendamento de Eventos esteja habilitado. Para obter informações sobre como verificar o status do Agendamento de Eventos e habilitá-lo, se necessário, consulte a Seção 23.4.2, “Configuração do Agendamento de Eventos”.

`CREATE EVENT` exige o privilégio `EVENT` para o esquema no qual o evento deve ser criado. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objeto Armazenado”.

Os requisitos mínimos para uma declaração válida do `CREATE EVENT` são os seguintes:

* As palavras-chave `CREATE EVENT` mais o nome de um evento, que identifica de forma única o evento em um esquema de banco de dados.

* Uma cláusula `ON SCHEDULE`, que determina quando e com que frequência o evento é executado.

* Uma cláusula `DO`, que contém a declaração SQL a ser executada por um evento.

Este é um exemplo de uma declaração mínima do `CREATE EVENT`:

```sql
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

A declaração anterior cria um evento chamado `myevent`. Esse evento é executado uma vez — uma hora após sua criação — executando uma declaração SQL que incrementa o valor da coluna `mycol` da tabela `myschema.mytable` em 1.

O *`event_name`* deve ser um identificador válido do MySQL com um comprimento máximo de 64 caracteres. Os nomes dos eventos não são sensíveis ao caso, portanto, não é possível ter dois eventos com os nomes `myevent` e `MyEvent` no mesmo esquema. Em geral, as regras que regem os nomes dos eventos são as mesmas que as que regem os nomes das rotinas armazenadas. Veja a Seção 9.2, “Nomes de Objetos do Esquema”.

Um evento está associado a um esquema. Se nenhum esquema for indicado como parte de *`event_name`*, o esquema padrão (atual) é assumido. Para criar um evento em um esquema específico, qualifique o nome do evento com um esquema usando a sintaxe `schema_name.event_name`.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da execução do evento. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança do evento.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE EVENT`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de um evento, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da execução do evento, que é o usuário `DEFINER`. Para informações sobre auditoria de usuários dentro de eventos, consulte a Seção 6.2.18, “Auditorização de atividade de conta baseada em SQL”.

`IF NOT EXISTS` tem o mesmo significado para `CREATE EVENT` e para `CREATE TABLE`: Se um evento chamado *`event_name`* já existir no mesmo esquema, nenhuma ação é realizada e não há erro. (No entanto, em tais casos, é gerado um aviso.)

A cláusula `ON SCHEDULE` determina quando, com que frequência e por quanto tempo o *`event_body`* definido para o evento se repete. Essa cláusula assume uma das duas formas:

* `AT timestamp` é usado para um evento único. Especifica que o evento é executado apenas uma vez na data e hora fornecidas por *`timestamp`*, que deve incluir tanto a data quanto a hora, ou deve ser uma expressão que resolva em um valor datetime. Você pode usar um valor do tipo `DATETIME` ou `TIMESTAMP` para esse propósito. Se a data estiver no passado, uma mensagem de aviso ocorre, como mostrado aqui:

  ```sql
  mysql> SELECT NOW();
  +---------------------+
  | NOW()               |
  +---------------------+
  | 2006-02-10 23:59:01 |
  +---------------------+
  1 row in set (0.04 sec)

  mysql> CREATE EVENT e_totals
      ->     ON SCHEDULE AT '2006-02-10 23:59:00'
      ->     DO INSERT INTO test.totals VALUES (NOW());
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1588
  Message: Event execution time is in the past and ON COMPLETION NOT
           PRESERVE is set. The event was dropped immediately after
           creation.
  ```

`CREATE EVENT` as declarações que, por qualquer motivo, são inválidas falham com um erro.

Você pode usar `CURRENT_TIMESTAMP` para especificar a data e hora atuais. Nesse caso, o evento é executado assim que é criado.

Para criar um evento que ocorra em algum momento no futuro em relação à data e hora atuais, como a expressão "três semanas a partir de agora", você pode usar a cláusula opcional `+ INTERVAL interval`. A parte *`interval`* consiste em duas partes, uma quantidade e uma unidade de tempo, e segue as regras de sintaxe descritas em Intervalos Temporais, exceto que você não pode usar nenhuma palavra-chave de unidade que envolva microssegundos ao definir um evento. Com alguns tipos de intervalo, unidades de tempo complexas podem ser usadas. Por exemplo, "dois minutos e dez segundos" podem ser expressos como `+ INTERVAL '2:10' MINUTE_SECOND`.

Você também pode combinar intervalos. Por exemplo, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` é equivalente a “três semanas e dois dias a partir de agora”. Cada parte de tal cláusula deve começar com `+ INTERVAL`.

* Para repetir ações em um intervalo regular, use uma cláusula `EVERY`. A palavra-chave `EVERY` é seguida por um *`interval`* como descrito na discussão anterior da palavra-chave `AT`. (`+ INTERVAL` *não* é usado com `EVERY`. Por exemplo, `EVERY 6 WEEK` significa “a cada seis semanas”.

Embora as cláusulas `+ INTERVAL` não sejam permitidas em uma cláusula `EVERY`, você pode usar as mesmas unidades de tempo complexas permitidas em uma `+ INTERVAL`.

Uma cláusula `EVERY` pode conter uma cláusula opcional `STARTS`. `STARTS` é seguida por um valor *`timestamp`* que indica quando a ação deve começar a se repetir, e também pode usar `+ INTERVAL interval` para especificar um período de tempo “a partir de agora”. Por exemplo, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` significa “a cada três meses, começando uma semana a partir de agora”. Da mesma forma, você pode expressar “a cada duas semanas, começando seis horas e quinze minutos a partir de agora” como `EVERY 2 WEEK STARTS CURRENT_TIMESTAMP

+ INTERVAL '6:15' HOUR_MINUTE`. Not specifying `STARTS` is the same as using `STARTS CURRENT_TIMESTAMP—ou seja, a ação especificada para o evento começa a se repetir imediatamente após a criação do evento.

Uma cláusula `EVERY` pode conter uma cláusula opcional `ENDS`. A palavra-chave `ENDS` é seguida por um valor *`timestamp`* que indica ao MySQL quando o evento deve parar de se repetir. Você também pode usar `+ INTERVAL interval` com `ENDS`; por exemplo, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` é equivalente a “a cada doze horas, começando trinta minutos a partir de agora e terminando quatro semanas a partir de agora”. Não usar `ENDS` significa que o evento continua sendo executado indefinidamente.

`ENDS` suporta a mesma sintaxe para unidades de tempo complexas que `STARTS` faz.

Você pode usar `STARTS`, `ENDS`, ambos ou nenhum deles em uma cláusula `EVERY`.

Se um evento repetitivo não terminar dentro do seu intervalo de programação, o resultado pode ser várias instâncias do evento executando simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de string ou tabela.

A cláusula `ON SCHEDULE` pode utilizar expressões que envolvam funções embutidas do MySQL e variáveis de usuário para obter qualquer um dos valores de *`timestamp`* ou *`interval`* que ela contém. Você não pode usar funções armazenadas ou funções carregáveis nessas expressões, nem pode usar referências a tabelas; no entanto, você pode usar `SELECT FROM DUAL`. Isso é verdadeiro tanto para as declarações `CREATE EVENT` quanto `ALTER EVENT`. Referências a funções armazenadas, funções carregáveis e tabelas, nesses casos, não são especificamente permitidas e falham com um erro (veja o Bug #22830).

Os horários na cláusula `ON SCHEDULE` são interpretados usando o valor atual da sessão `time_zone`. Isso se torna o fuso horário do evento; ou seja, o fuso horário que é usado para a programação de eventos e que está em vigor dentro do evento conforme ele é executado. Esses horários são convertidos para UTC e armazenados juntamente com o fuso horário do evento na tabela `mysql.event`. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. Para informações adicionais sobre a representação dos horários dos eventos, consulte a Seção 23.4.4, “Metadados do Evento”. Veja também a Seção 13.7.5.18, “Declaração SHOW EVENTS”, e a Seção 24.3.8, “A Tabela INFORMATION\_SCHEMA EVENTS”.

Normalmente, uma vez que um evento tenha expirado, ele é imediatamente descartado. Você pode sobrepor esse comportamento especificando `ON COMPLETION PRESERVE`. Usar `ON COMPLETION NOT PRESERVE` apenas torna o comportamento não persistente padrão explícito.

Você pode criar um evento, mas impedir que ele seja ativo usando a palavra-chave `DISABLE`. Alternativamente, você pode usar `ENABLE` para tornar explícito o status padrão, que é ativo. Isso é mais útil em conjunto com `ALTER EVENT` (consulte Seção 13.1.2, “Instrução ALTER EVENT”).

Um terceiro valor também pode aparecer no lugar de `ENABLE` ou `DISABLE`; `DISABLE ON SLAVE` é definido para o status de um evento em uma réplica para indicar que o evento foi criado na fonte e replicado para a réplica, mas não é executado na réplica. Veja a Seção 16.4.1.16, “Replicação de Recursos Convocados”.

Você pode fornecer um comentário para um evento usando uma cláusula `COMMENT`. *`comment`* pode ser qualquer string de até 64 caracteres que você deseja usar para descrever o evento. O texto do comentário, sendo uma literal de string, deve ser rodeado por aspas.

A cláusula `DO` especifica uma ação realizada pelo evento e consiste em uma declaração SQL. Quase qualquer declaração válida do MySQL que possa ser usada em uma rotina armazenada também pode ser usada como a declaração de ação para um evento agendado. (Veja a Seção 23.8, “Restrições em Programas Armazenados”.) Por exemplo, o seguinte evento `e_hourly` exclui todas as strings da tabela `sessions` uma vez por hora, onde esta tabela faz parte do esquema `site_activity`:

```sql
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando um evento é criado ou alterado, e sempre executa o evento com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando o evento começa a ser executado*.

Uma declaração `CREATE EVENT` que contém uma declaração `ALTER EVENT` em sua cláusula `DO` parece ter sucesso; no entanto, quando o servidor tenta executar o evento agendado resultante, a execução falha com um erro.

Nota

Declarações como `SELECT` ou `SHOW` que simplesmente retornam um conjunto de resultados não têm efeito quando usadas em um evento; a saída dessas declarações não é enviada para o Monitor MySQL, nem é armazenada em nenhum lugar. No entanto, você pode usar declarações como `SELECT ... INTO` e `INSERT INTO ... SELECT` que armazenam um resultado. (Veja o próximo exemplo nesta seção para uma instância do último.)

O esquema ao qual um evento pertence é o esquema padrão para referências de tabela na cláusula `DO`. Quaisquer referências a tabelas em outros esquemas devem ser qualificadas com o nome do esquema apropriado.

Assim como nas rotinas armazenadas, você pode usar a sintaxe de declaração composta na cláusula `DO` usando as palavras-chave `BEGIN` e `END`, conforme mostrado aqui:

```sql
delimiter |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

delimiter ;
```

Este exemplo usa o comando `delimiter` para alterar o delimitador de declaração. Veja a Seção 23.1, “Definindo programas armazenados”.

É possível criar declarações compostas mais complexas, como as utilizadas em rotinas armazenadas, em um evento. Este exemplo utiliza variáveis locais, um manipulador de erro e uma construção de controle de fluxo:

```sql
delimiter |

CREATE EVENT e
    ON SCHEDULE
      EVERY 5 SECOND
    DO
      BEGIN
        DECLARE v INTEGER;
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

        SET v = 0;

        WHILE v < 5 DO
          INSERT INTO t1 VALUES (0);
          UPDATE t2 SET s1 = s1 + 1;
          SET v = v + 1;
        END WHILE;
    END |

delimiter ;
```

Não é possível passar parâmetros diretamente para ou a partir de eventos; no entanto, é possível invocar uma rotina armazenada com parâmetros dentro de um evento:

```sql
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

Se o definidor de um evento tiver privilégios suficientes para definir variáveis de sistema global (consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”), o evento pode ler e escrever variáveis globais. Como a concessão desses privilégios implica em um potencial de abuso, é necessário ter extremo cuidado ao fazê-lo.

Geralmente, quaisquer declarações que sejam válidas em rotinas armazenadas podem ser usadas para declarações de ação executadas por eventos. Para mais informações sobre declarações permitidas dentro de rotinas armazenadas, consulte a Seção 23.2.1, “Sintaxe de Rotina Armazenada”. Você pode criar um evento como parte de uma rotina armazenada, mas um evento não pode ser criado por outro evento.

### 13.1.13 Declaração de Função CREATE

### 13.1.14 SELECT Statement
### 13.1.15 INSERT Statement
### 13.1.16 UPDATE Statement
### 13.1.17 DELETE Statement
### 13.1.18 DROP Statement
### 13.1.19 ALTER Statement
### 13.1.20 CREATE TABLE Statement
### 13.1.21 DROP TABLE Statement
### 13.1.22 SELECT INTO Statement
### 13.1.23 INSERT INTO Statement
### 13.1.24 UPDATE INTO Statement
### 13.1.25 DELETE INTO Statement
### 13.1.26 DROP INTO Statement

A declaração `CREATE FUNCTION` é usada para criar funções armazenadas e funções carregáveis:

* Para informações sobre a criação de funções armazenadas, consulte a Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.

* Para informações sobre a criação de funções carregáveis, consulte a Seção 13.7.3.1, “Instrução CREATE FUNCTION para Funções Carregáveis”.

### 13.1.14 Declaração CREATE INDEX

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part:
    col_name [(length)] [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normalmente, você cria todos os índices em uma tabela no momento em que a própria tabela é criada com `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”. Esta diretriz é especialmente importante para as tabelas `InnoDB`, onde a chave primária determina o layout físico das strings no arquivo de dados. `CREATE INDEX` permite que você adicione índices a tabelas existentes.

`CREATE INDEX` é mapeado para uma declaração `ALTER TABLE` para criar índices. Veja a Seção 13.1.8, “Declaração ALTER TABLE”. `CREATE INDEX` não pode ser usado para criar um `PRIMARY KEY`; use `ALTER TABLE` em vez disso. Para mais informações sobre índices, consulte a Seção 8.3.1, “Como o MySQL usa índices”.

`InnoDB` suporta índices secundários em colunas virtuais. Para mais informações, consulte a Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

Quando a configuração `innodb_stats_persistent` estiver habilitada, execute a instrução `ANALYZE TABLE` para uma tabela `InnoDB` após criar um índice nessa tabela.

Uma especificação de índice na forma `(key_part1, key_part2, ...)` cria um índice com várias partes de chave. Os valores da chave do índice são formados pela concatenação dos valores das partes de chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um índice de múltiplos colunas com chaves de índice consistindo em valores de `col1`, `col2` e `col3`.

Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões para especificar armazenamento de valor de índice ascendente ou descendente. Atualmente, elas são analisadas, mas ignoradas; os valores de índice são sempre armazenados em ordem ascendente.

As seções a seguir descrevem diferentes aspectos da declaração `CREATE INDEX`:

* Prefix da coluna Chave de partes
* Índices únicos
* Índices de texto completo
* Índices espaciais
* Opções de índice
* Opções de cópia e bloqueio de tabela

#### Coluna Prefixo Chave Peças Essenciais

Para colunas de texto, é possível criar índices que utilizem apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice:

* Prefixos podem ser especificados para as partes principais `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

* Os prefixos *devem* ser especificados para as partes de chave `BLOB` e `TEXT`. Além disso, as colunas `BLOB` e `TEXT` podem ser indexadas apenas para as tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

* Os prefixos *limites* são medidos em bytes. No entanto, os prefixos *longos* para especificações de índice nas declarações de `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

O suporte a prefixos e as comprimentos dos prefixos (quando suportados) dependem do mecanismo de armazenamento. Por exemplo, um prefixo pode ter até 767 bytes para as tabelas `InnoDB` ou 3072 bytes se a opção `innodb_large_prefix` estiver habilitada. Para as tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes. O mecanismo de armazenamento `NDB` não suporta prefixos (consulte a Seção 21.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”).

A partir do MySQL 5.7.17, se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, `CREATE INDEX` trata o índice da seguinte forma:

* Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dados da coluna e uma advertência é gerada (se o modo SQL rigoroso não estiver habilitado).

* Para um índice único, ocorre um erro independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um índice usando os primeiros 10 caracteres da coluna `name` (assumindo que `name` tenha um tipo de string não binária):

```sql
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as pesquisas realizadas usando este índice não devem ser muito mais lentas do que usando um índice criado a partir de toda a coluna `name`. Além disso, usar prefixos de coluna para índices pode tornar o arquivo do índice muito menor, o que pode economizar muito espaço em disco e também acelerar as operações do `INSERT`.

#### Índices Únicos

Um índice `UNIQUE` cria uma restrição de modo que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova string com um valor de chave que corresponda a uma string existente. Se você especificar um valor prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo. Um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas declarações `SELECT`, conforme a seguir:

* `_rowid` refere-se à coluna `PRIMARY KEY` se houver um `PRIMARY KEY` composto por uma única coluna de número inteiro. Se houver um `PRIMARY KEY`, mas ele não consista em uma única coluna de número inteiro, `_rowid` não pode ser usado.

* Caso contrário, `_rowid` se refere à coluna no primeiro índice `UNIQUE NOT NULL` se esse índice consistir em uma única coluna de inteiro. Se o primeiro índice `UNIQUE NOT NULL` não consistir em uma única coluna de inteiro, `_rowid` não pode ser usado.

#### Índices de texto completo

Os índices `FULLTEXT` são suportados apenas para as tabelas `InnoDB` e `MyISAM` e podem incluir apenas as colunas `CHAR`, `VARCHAR` e `TEXT`. O indexação sempre ocorre sobre toda a coluna; a indexação com prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”, para detalhes da operação.

#### Índices Espaciais

Os motores de armazenamento `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE` suportam colunas espaciais, como `POINT` e `GEOMETRY`. (A seção 11.4, “Tipos de dados espaciais”, descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os motores. Índices espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Os índices espaciais em colunas espaciais (criados usando `SPATIAL INDEX`) têm essas características:

* Disponível apenas para as tabelas `MyISAM` e `InnoDB`. Especificar `SPATIAL INDEX` para outros motores de armazenamento resulta em um erro.

* As colunas indexadas devem ser `NOT NULL`. * As extensões de prefixo das colunas são proibidas. O comprimento total de cada coluna é indexado.

Os índices não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm essas características:

* Permitido para qualquer motor de armazenamento que suporte colunas espaciais, exceto `ARCHIVE`.

* As colunas podem ser `NULL` a menos que o índice seja uma chave primária.

* Para cada coluna espacial em um índice que não seja `SPATIAL`, exceto as colunas de `POINT`, deve ser especificado o comprimento do prefixo da coluna. (Essa é a mesma exigência para as colunas indexadas de `BLOB`. O comprimento do prefixo é dado em bytes.

* O tipo de índice para um índice não `SPATIAL` depende do motor de armazenamento. Atualmente, a árvore B é usada.

* Permitido para uma coluna que pode ter valores de `NULL` apenas para as tabelas `InnoDB`, `MyISAM` e `MEMORY`.

#### Opções de índice

Após a lista de peças-chave, as opções de índice podem ser fornecidas. Um valor *`index_option`* pode ser qualquer um dos seguintes:

* `KEY_BLOCK_SIZE [=] value`

Para as tabelas de `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para blocos de chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de nível de tabela de `KEY_BLOCK_SIZE`.

`KEY_BLOCK_SIZE` não é suportado no nível do índice para as tabelas `InnoDB`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

* *`index_type`*

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. Por exemplo:

  ```sql
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

A Tabela 13.1, “Tipos de índice por motor de armazenamento”, mostra os valores de tipo de índice permitidos suportados por diferentes motores de armazenamento. Quando vários tipos de índice são listados, o primeiro é o padrão quando não é especificado um especificador de tipo de índice. Motores de armazenamento não listados na tabela não suportam uma cláusula *`index_type`* em definições de índice.

**Tabela 13.1 Tipos de índice por motor de armazenamento**

  <table summary="Permissible index types by storage engine."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Storage Engine</th> <th>Tipos de índice permitidos</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MyISAM</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MEMORY</code>/<code>HEAP</code></td> <td><code>HASH</code>,<code>BTREE</code></td> </tr><tr> <td><code>NDB</code></td> <td><code>HASH</code>,<code>BTREE</code>(ver nota no texto)</td> </tr></tbody></table>

A cláusula *`index_type`* não pode ser usada para as especificações de `FULLTEXT INDEX` ou `SPATIAL INDEX`. A implementação de índice de texto completo depende do mecanismo de armazenamento. Os índices espaciais são implementados como índices R-tree.

Os índices `BTREE` são implementados pelo mecanismo de armazenamento `NDB` como índices T-tree.

Nota

Para índices nas colunas da tabela `NDB`, a opção `USING` pode ser especificada apenas para um índice único ou chave primária. `USING HASH` impede a criação de um índice ordenado; caso contrário, a criação de um índice único ou chave primária em uma tabela `NDB` resulta automaticamente na criação tanto de um índice ordenado quanto de um índice de hash, cada um dos quais indexa o mesmo conjunto de colunas.

Para índices únicos que incluem uma ou mais colunas `NULL` de uma tabela `NDB`, o índice de hash pode ser usado apenas para procurar valores literais, o que significa que as condições `IS [NOT] NULL` exigem uma varredura completa da tabela. Uma solução é garantir que um índice único que use uma ou mais colunas `NULL` em tal tabela seja sempre criado de tal forma que inclua o índice ordenado; ou seja, evitar empregar `USING HASH` ao criar o índice.

Se você especificar um tipo de índice que não é válido para um motor de armazenamento específico, mas outro tipo de índice está disponível e o motor pode usar sem afetar os resultados das consultas, o motor usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para qualquer motor de armazenamento.

Nota

O uso da opção *`index_type`* antes da cláusula `ON tbl_name` é desaconselhável; você deve esperar que o suporte para o uso da opção nessa posição seja removido em um lançamento futuro do MySQL. Se uma opção *`index_type`* for dada em ambas as posições anteriores e posteriores, a opção final se aplica.

`TYPE type_name` é reconhecido como sinônimo de `USING type_name`. No entanto, `USING` é a forma preferida.

As tabelas a seguir mostram as características do índice para os motores de armazenamento que suportam a opção *`index_type`*.

**Tabela 13.2 Características do Engate de Armazenamento InnoDB**

  <table summary="Index characteristics of the InnoDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de índice</th> <th>Tipo de índice</th> <th>Armazenar valores NULL</th> <th>Permite múltiplos valores nulos</th> <th>Tipo de varredura IS NULL</th> <th>Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

**Tabela 13.3 Características do motor de armazenamento MyISAM**

  <table summary="Index characteristics of the MyISAM storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de índice</th> <th>Tipo de índice</th> <th>Armazenar valores NULL</th> <th>Permite múltiplos valores nulos</th> <th>Tipo de varredura IS NULL</th> <th>Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

**Tabela 13.4 Características do Índice do Motor de Armazenamento de MEMÓRIA**

  <table summary="Index characteristics of the Memory storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de índice</th> <th>Tipo de índice</th> <th>Armazenar valores NULL</th> <th>Permite múltiplos valores nulos</th> <th>Tipo de varredura IS NULL</th> <th>Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr></tbody></table>

**Tabela 13.5 Características do Índice do Engate de Armazenamento NDB**

  <table summary="Index characteristics of the NDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de índice</th> <th>Tipo de índice</th> <th>Armazenar valores NULL</th> <th>Permite múltiplos valores nulos</th> <th>Tipo de varredura IS NULL</th> <th>Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr></tbody></table>

Nota da tabela:

1. Se `USING HASH` for especificado, isso impede a criação de um índice ordenado implícito.

* `WITH PARSER parser_name`

Essa opção só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de análise a índice se as operações de indexação e busca de texto completo necessitam de tratamento especial. `InnoDB` e `MyISAM` suportam plugins de análise de texto completo. Se você tem uma tabela `MyISAM` com um plugin de análise de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Consulte Plugins de Análise de Texto Completo e Escrita de Plugins de Análise de Texto Completo para mais informações.

* `COMMENT 'string'`

As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

O `MERGE_THRESHOLD` para páginas de índice pode ser configurado para índices individuais usando a cláusula *`index_option`* `COMMENT` da declaração `CREATE INDEX`. Por exemplo:

  ```sql
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

Se a porcentagem de página cheia para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma string é excluída ou quando uma string é encurtada por uma operação de atualização, `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão `MERGE_THRESHOLD` é 50, que é o valor previamente codificado.

`MERGE_THRESHOLD` também pode ser definido no nível do índice e no nível da tabela usando as declarações `CREATE TABLE` e `ALTER TABLE`. Para mais informações, consulte a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

#### Opções de Copiar e Acelerar a Tabela
#### Opções de Copiar e Acelerar a Tabela

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a declaração `ALTER TABLE`. Para mais informações, consulte a Seção 13.1.8, “Declaração ALTER TABLE”

O NDB Cluster anteriormente suportava operações online `CREATE INDEX` usando uma sintaxe alternativa que não é mais suportada. O NDB Cluster agora suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

### 13.1.15 Declaração CREATE LOGFILE GROUP

```sql
CREATE LOGFILE GROUP logfile_group
    ADD UNDOFILE 'undo_file'
    [INITIAL_SIZE [=] initial_size]
    [UNDO_BUFFER_SIZE [=] undo_buffer_size]
    [REDO_BUFFER_SIZE [=] redo_buffer_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']
    ENGINE [=] engine_name
```

Essa declaração cria um novo grupo de arquivo de registro denominado *`logfile_group`* com um único arquivo `UNDO` denominado '*`undo_file`*. Uma declaração `CREATE LOGFILE GROUP` tem uma e apenas uma cláusula `ADD UNDOFILE`. Para regras que cobrem a nomeação de grupos de arquivos de registro, consulte a Seção 9.2, “Nomes de Objetos do Esquema”.

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de registro com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Só pode haver um grupo de arquivos de registro por instância do NDB Cluster em qualquer momento.

O parâmetro opcional `INITIAL_SIZE` define o tamanho inicial do arquivo `UNDO`; se não especificado, ele é predefinido como `128M` (128 megabytes). O parâmetro opcional `UNDO_BUFFER_SIZE` define o tamanho usado pelo buffer `UNDO` para o grupo de arquivos de registro; O valor padrão para `UNDO_BUFFER_SIZE` é `8M` (oito megabytes); esse valor não pode exceder a quantidade de memória do sistema disponível. Ambos desses parâmetros são especificados em bytes. Você pode opcionalmente seguir um ou ambos desses com uma abreviação de uma letra para uma ordem de magnitude, semelhante àquelas usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

A memória usada para `UNDO_BUFFER_SIZE` vem do pool global, cujo tamanho é determinado pelo valor do parâmetro de configuração do nó de dados `SharedGlobalMemory`. Isso inclui qualquer valor padrão implícito para esta opção pela configuração do parâmetro de configuração do nó de dados `InitialLogFileGroup`.

O máximo permitido para `UNDO_BUFFER_SIZE` é 629145600 (600 MB).

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB). (Bug #29186)

O valor mínimo permitido para `INITIAL_SIZE` é 1048576 (1 MB).

A opção `ENGINE` determina o motor de armazenamento a ser utilizado por este grupo de arquivos de registro, com *`engine_name`* sendo o nome do motor de armazenamento. No MySQL 5.7, isso deve ser `NDB` (ou `NDBCLUSTER`). Se `ENGINE` não estiver definido, o MySQL tenta usar o motor especificado pela variável de sistema do servidor `default_storage_engine` (anteriormente `storage_engine`). Em qualquer caso, se o motor não for especificado como `NDB` ou `NDBCLUSTER`, a declaração `CREATE LOGFILE GROUP` parece ter sucesso, mas na verdade não cria o grupo de arquivos de registro, como mostrado aqui:

```sql
mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------------------------------------------------------------+
| Level | Code | Message                                                                                        |
+-------+------+------------------------------------------------------------------------------------------------+
| Error | 1478 | Table storage engine 'InnoDB' does not support the create option 'TABLESPACE or LOGFILE GROUP' |
+-------+------+------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> DROP LOGFILE GROUP lg1 ENGINE = NDB;
ERROR 1529 (HY000): Failed to drop LOGFILE GROUP

mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M
    ->     ENGINE = NDB;
Query OK, 0 rows affected (2.97 sec)
```

O fato de que a declaração `CREATE LOGFILE GROUP` não retorna realmente um erro quando um motor de armazenamento que não é `NDB` é nomeado, mas sim parece ter sucesso, é um problema conhecido que esperamos resolver em um lançamento futuro do NDB Cluster.

*`REDO_BUFFER_SIZE`*, `NODEGROUP`, `WAIT` e `COMMENT` são analisados, mas ignorados, e, portanto, não têm efeito no MySQL 5.7. Essas opções são destinadas à expansão futura.

Quando usado com `ENGINE [=] NDB`, um grupo de arquivos de registro e o arquivo de registro associado `UNDO` são criados em cada nó de dados do cluster. Você pode verificar se os arquivos `UNDO` foram criados e obter informações sobre eles, fazendo uma consulta à tabela do esquema de informações `FILES`. Por exemplo:

```sql
mysql> SELECT LOGFILE_GROUP_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE FILE_NAME = 'undo_10.dat';
+--------------------+----------------------+----------------+
| LOGFILE_GROUP_NAME | LOGFILE_GROUP_NUMBER | EXTRA          |
+--------------------+----------------------+----------------+
| lg_3               |                   11 | CLUSTER_NODE=3 |
| lg_3               |                   11 | CLUSTER_NODE=4 |
+--------------------+----------------------+----------------+
2 rows in set (0.06 sec)
```

`CREATE LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Veja a Seção 21.6.11, “Tabelas de dados de disco do NDB Cluster”.

### 13.1.16 Estruturas de comandos CREATE PROCEDURE e CREATE FUNCTION

```sql
CREATE
    [DEFINER = user]
    PROCEDURE sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body

CREATE
    [DEFINER = user]
    FUNCTION sp_name ([func_parameter[,...]])
    RETURNS type
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

Essas declarações são usadas para criar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada se torna conhecida pelo servidor. Por padrão, uma rotina armazenada é associada ao banco de dados padrão. Para associar explicitamente a rotina com um banco de dados específico, especifique o nome como *`db_name.sp_name`* ao criá-la.

A declaração `CREATE FUNCTION` também é usada no MySQL para suportar funções carregáveis. Veja a Seção 13.7.3.1, “Declaração CREATE FUNCTION para Funções Carregáveis”. Uma função carregável pode ser considerada uma função armazenada externa. As funções armazenadas compartilham seu espaço de nome com as funções carregáveis. Veja a Seção 9.2.5, “Parágrafo de nome de função e resolução”, para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções.

Para invocar um procedimento armazenado, use a declaração `CALL` (consulte Seção 13.2.1, “Declaração CALL”). Para invocar uma função armazenada, consulte-a em uma expressão. A função retorna um valor durante a avaliação da expressão.

`CREATE PROCEDURE` e `CREATE FUNCTION` exigem o privilégio `CREATE ROUTINE`. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE FUNCTION` pode exigir o privilégio `SUPER`, conforme discutido na Seção 23.7, “Registro Binário de Programas Armazenados”.

Por padrão, o MySQL concede automaticamente os privilégios `ALTER ROUTINE` e `EXECUTE` ao criador da rotina. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja a Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da execução rotineira, conforme descrito mais adiante nesta seção.

Se o nome da rotina for o mesmo que o nome de uma função SQL embutida, ocorrerá um erro de sintaxe, a menos que você use um espaço entre o nome e os parênteses subsequentes ao definir a rotina ou invocá-la posteriormente. Por essa razão, evite usar os nomes de funções SQL existentes para suas próprias rotinas armazenadas.

O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a rotinas armazenadas. É sempre permitido ter espaços após o nome de uma rotina armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

A lista de parâmetros fechada entre parênteses deve estar sempre presente. Se não houver parâmetros, deve-se usar uma lista de parâmetros vazia de `()`. Os nomes dos parâmetros não são sensíveis ao caso.

Cada parâmetro é um parâmetro `IN` por padrão. Para especificar de outra forma para um parâmetro, use a palavra-chave `OUT` ou `INOUT` antes do nome do parâmetro.

Nota

Especificar um parâmetro como `IN`, `OUT` ou `INOUT` é válido apenas para um `PROCEDURE`. Para um `FUNCTION`, os parâmetros são sempre considerados parâmetros `IN`.

Um parâmetro `IN` passa um valor para um procedimento. O procedimento pode modificar o valor, mas a modificação não é visível para o solicitante quando o procedimento retorna. Um parâmetro `OUT` passa um valor do procedimento de volta para o solicitante. Seu valor inicial é `NULL` dentro do procedimento, e seu valor é visível para o solicitante quando o procedimento retorna. Um parâmetro `INOUT` é inicializado pelo solicitante, pode ser modificado pelo procedimento e qualquer alteração feita pelo procedimento é visível para o solicitante quando o procedimento retorna.

Para cada parâmetro `OUT` ou `INOUT`, passe uma variável definida pelo usuário na declaração `CALL` que invoca o procedimento, para que você possa obter seu valor quando o procedimento retornar. Se você estiver chamando o procedimento de dentro de outra procedure ou função armazenada, também pode passar um parâmetro de rotina ou uma variável de rotina local como um parâmetro `OUT` ou `INOUT`. Se você estiver chamando o procedimento de dentro de um gatilho, também pode passar `NEW.col_name` como um parâmetro `OUT` ou `INOUT`.

Para informações sobre o efeito das condições não tratadas nos parâmetros do procedimento, consulte a Seção 13.6.7.8, “Tratamento de condições e parâmetros OUT ou INOUT”.

Os parâmetros de rotina não podem ser referenciados em declarações preparadas dentro da rotina; veja a Seção 23.8, “Restrições sobre programas armazenados”.

O exemplo a seguir mostra um procedimento armazenado simples que, dado um código de país, conta o número de cidades desse país que aparecem na tabela `city` do banco de dados `world`. O código de país é passado usando um parâmetro `IN`, e o número de cidades é retornado usando um parâmetro `OUT`:

```sql
mysql> delimiter //

mysql> CREATE PROCEDURE citycount (IN country CHAR(3), OUT cities INT)
       BEGIN
         SELECT COUNT(*) INTO cities FROM world.city
         WHERE CountryCode = country;
       END//
Query OK, 0 rows affected (0.01 sec)

mysql> delimiter ;

mysql> CALL citycount('JPN', @cities); -- cities in Japan
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|     248 |
+---------+
1 row in set (0.00 sec)

mysql> CALL citycount('FRA', @cities); -- cities in France
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|      40 |
+---------+
1 row in set (0.00 sec)
```

O exemplo utiliza o comando do cliente **mysql** `delimiter` para alterar o delimitador da declaração de `;` para `//` enquanto o procedimento está sendo definido. Isso permite que o delimitador `;` usado no corpo do procedimento seja passado para o servidor em vez de ser interpretado pelo próprio **mysql**. Veja a Seção 23.1, “Definindo programas armazenados”.

A cláusula `RETURNS` pode ser especificada apenas para um `FUNCTION`, para o qual é obrigatória. Ela indica o tipo de retorno da função, e o corpo da função deve conter uma declaração `RETURN value`. Se a declaração `RETURN` retornar um valor de um tipo diferente, o valor é coercido para o tipo apropriado. Por exemplo, se uma função especifica um valor de `ENUM` ou `SET` na cláusula `RETURNS`, mas a declaração `RETURN` retorna um inteiro, o valor retornado da função é a string para o membro correspondente `ENUM` do conjunto de membros `SET`.

A função a seguir recebe um parâmetro, realiza uma operação usando uma função SQL e retorna o resultado. Neste caso, não é necessário usar `delimiter`, porque a definição da função não contém delimitadores internos de `;`:

```sql
mysql> CREATE FUNCTION hello (s CHAR(20))
    ->   RETURNS CHAR(50) DETERMINISTIC
    ->   RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```

Os tipos de parâmetros e os tipos de retorno de função podem ser declarados para usar qualquer tipo de dado válido. O atributo `COLLATE` pode ser usado se precedido por uma especificação `CHARACTER SET`.

O *`routine_body` consiste em uma declaração válida de rotina SQL. Isso pode ser uma declaração simples, como `SELECT` ou `INSERT`, ou uma declaração composta escrita usando `BEGIN` e `END`. As declarações compostas podem conter declarações, laços e outras declarações de estruturas de controle. A sintaxe dessas declarações é descrita na Seção 13.6, “Declarações Compostas”. Na prática, as funções armazenadas tendem a usar declarações compostas, a menos que o corpo consista em uma única declaração `RETURN`.

O MySQL permite que rotinas contenham declarações DDL, como `CREATE` e `DROP`. O MySQL também permite que procedimentos armazenados (mas não funções armazenadas) contenham declarações de transação SQL, como `COMMIT`. As funções armazenadas não podem conter declarações que realizem um commit ou rollback explícito ou implícito. O suporte para essas declarações não é exigido pelo padrão SQL, que afirma que cada fornecedor de SGBD pode decidir se as permite.

As declarações que retornam um conjunto de resultados podem ser usadas em um procedimento armazenado, mas não em uma função armazenada. Essa proibição inclui as declarações `SELECT` que não possuem uma cláusula `INTO var_list` e outras declarações, como `SHOW`, `EXPLAIN` e `CHECK TABLE`. Para declarações que podem ser determinadas no momento da definição da função como retornando um conjunto de resultados, ocorre um erro `Not allowed to return a result set from a function` (`ER_SP_NO_RETSET`). Para declarações que podem ser determinadas apenas no momento da execução como retornando um conjunto de resultados, ocorre um erro `PROCEDURE %s can't return a result set in the given context` (`ER_SP_BADSELECT`).

`USE` declarações dentro de rotinas armazenadas não são permitidas. Quando uma rotina é invocada, um `USE db_name` implícito é realizado (e desfeito quando a rotina termina). Isso faz com que a rotina tenha o banco de dados padrão especificado enquanto está sendo executada. Referências a objetos em bancos de dados que não são o banco de dados padrão da rotina devem ser qualificadas com o nome do banco de dados apropriado.

Para informações adicionais sobre declarações que não são permitidas em rotinas armazenadas, consulte a Seção 23.8, “Restrições em Programas Armazenados”.

Para obter informações sobre como invocar procedimentos armazenados a partir de programas escritos em uma linguagem que tem uma interface MySQL, consulte a Seção 13.2.1, “Instrução CALL”.

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando uma rotina é criada ou alterada, e sempre executa a rotina com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando a rotina começa a ser executada*.

A mudança do modo SQL do invocador para o modo da rotina ocorre após a avaliação dos argumentos e a atribuição dos valores resultantes aos parâmetros da rotina. Se você definir uma rotina em modo SQL estrito, mas a invocar em modo não estrito, a atribuição dos argumentos aos parâmetros da rotina não ocorre em modo estrito. Se você precisar que as expressões passadas para uma rotina sejam atribuídas em modo SQL estrito, você deve invocar a rotina com o modo estrito em vigor.

A característica `COMMENT` é uma extensão do MySQL e pode ser usada para descrever a rotina armazenada. Essa informação é exibida pelas declarações `SHOW CREATE PROCEDURE` e `SHOW CREATE FUNCTION`.

A característica `LANGUAGE` indica o idioma em que a rotina é escrita. O servidor ignora essa característica; apenas as rotinas SQL são suportadas.

Uma rotina é considerada “determinística” se sempre produzir o mesmo resultado para os mesmos parâmetros de entrada, e “não determinística” caso contrário. Se nem `DETERMINISTIC` nem `NOT DETERMINISTIC` é dado na definição da rotina, o padrão é `NOT DETERMINISTIC`. Para declarar que uma função é determinística, você deve especificar explicitamente `DETERMINISTIC`.

A avaliação da natureza de uma rotina é baseada na "honestidade" do criador: o MySQL não verifica se uma rotina declarada `DETERMINISTIC` está livre de declarações que produzem resultados não determinísticos. No entanto, declarar uma rotina incorretamente pode afetar os resultados ou o desempenho. Declarar uma rotina não determinística como `DETERMINISTIC` pode levar a resultados inesperados, pois o otimizador pode tomar escolhas incorretas no plano de execução. Declarar uma rotina determinística como `NONDETERMINISTIC` pode diminuir o desempenho, pois pode impedir que otimizações disponíveis sejam usadas.

Se o registro binário estiver habilitado, a característica `DETERMINISTIC` afeta quais definições de rotina o MySQL aceita. Veja a Seção 23.7, “Registro Binário de Programa Armazenado”.

Uma rotina que contém a função `NOW()` (ou seus sinônimos) ou `RAND()` é não determinística, mas ainda pode ser segura para replicação. Para `NOW()`, o log binário inclui o timestamp e replica corretamente. `RAND()` também replica corretamente, desde que seja chamado apenas uma única vez durante a execução de uma rotina. (Você pode considerar o timestamp de execução da rotina e a semente de número aleatório como entradas implícitas que são idênticas na fonte e na replica.)

Várias características fornecem informações sobre a natureza do uso dos dados pela rotina. No MySQL, essas características são apenas indicativas. O servidor não as usa para restringir os tipos de declarações que uma rotina é permitida para executar.

* `CONTAINS SQL` indica que a rotina não contém declarações que leem ou escrevem dados. Este é o padrão se nenhuma dessas características for explicitamente dada. Exemplos de tais declarações são `SET @x = 1` ou `DO RELEASE_LOCK('abc')`, que executam, mas não leem nem escrevem dados.

* `NO SQL` indica que a rotina não contém nenhuma declaração SQL.

* `READS SQL DATA` indica que a rotina contém declarações que leem dados (por exemplo, `SELECT`), mas não declarações que escrevem dados.

* `MODIFIES SQL DATA` indica que a rotina contém declarações que podem escrever dados (por exemplo, `INSERT` ou `DELETE`).

A característica `SQL SECURITY` pode ser `DEFINER` ou `INVOKER` para especificar o contexto de segurança, ou seja, se a rotina executa usando os privilégios da conta nomeada na cláusula da rotina `DEFINER` ou do usuário que a invoca. Essa conta deve ter permissão para acessar o banco de dados com o qual a rotina está associada. O valor padrão é `DEFINER`. O usuário que invoca a rotina deve ter o `EXECUTE` privilégio para isso, assim como a conta `DEFINER` se a rotina for executada em um contexto de segurança definido.

A cláusula `DEFINER` especifica a conta do MySQL a ser utilizada ao verificar privilégios de acesso no momento da execução de rotinas para rotinas que possuem a característica `SQL SECURITY DEFINER`.

Se a cláusula `DEFINER` estiver presente, o valor do *`user`* deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores permitidos do *`user`* dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de acesso a objetos armazenados”. Veja também essa seção para obter informações adicionais sobre a segurança de rotinas armazenadas.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE PROCEDURE` ou `CREATE FUNCTION`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro do corpo de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, a função `CURRENT_USER` retorna o valor da rotina `DEFINER`. Para informações sobre auditoria de usuários dentro de rotinas armazenadas, consulte a Seção 6.2.18, “Auditoria de atividade de conta baseada em SQL”.

Considere o procedimento a seguir, que exibe um contador do número de contas do MySQL listadas na tabela do sistema `mysql.user`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento é atribuído à conta `DEFINER` de `'admin'@'localhost'`, independentemente de qual usuário o defina. Ele é executado com os privilégios dessa conta, independentemente de qual usuário o invoque (porque a característica de segurança padrão é `DEFINER`). O procedimento tem sucesso ou falha dependendo se o invocador tem o privilégio `EXECUTE` para ele e `'admin'@'localhost'` tem o privilégio `SELECT` para a tabela `mysql.user`.

Agora, suponha que o procedimento seja definido com a característica `SQL SECURITY INVOKER`:

```sql
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

O procedimento ainda tem um `DEFINER` de `'admin'@'localhost'`, mas, neste caso, ele é executado com os privilégios do usuário que o invoca. Assim, o procedimento tem sucesso ou falha dependendo se o invocador tem o privilégio `EXECUTE` para ele e o privilégio `SELECT` para a tabela `mysql.user`.

O servidor lida com o tipo de dados de um parâmetro de rotina, variável local de rotina criada com `DECLARE`, ou o valor de retorno de função da seguinte forma:

* As atribuições são verificadas quanto a desalinhamentos de tipo de dados e sobrecarga. Problemas de conversão e sobrecarga resultam em avisos ou erros no modo SQL rigoroso.

* Apenas valores escalares podem ser atribuídos. Por exemplo, uma declaração como `SET x = (SELECT 1, 2)` é inválida.

* Para os tipos de dados de caracteres, se `CHARACTER SET` é incluído na declaração, o conjunto de caracteres especificado e sua ordenação padrão são usados. Se o atributo `COLLATE` também estiver presente, essa ordenação é usada em vez da ordenação padrão.

Se `CHARACTER SET` e `COLLATE` não estiverem presentes, o conjunto de caracteres e a correção de dados do banco de dados em vigor no momento da criação rotineira são utilizados. Para evitar que o servidor use o conjunto de caracteres e a correção de dados do banco de dados, forneça um atributo explícito `CHARACTER SET` e `COLLATE` para os parâmetros de dados de caracteres.

Se você alterar o conjunto de caracteres ou a agregação padrão do banco de dados, as rotinas armazenadas que devem usar os novos padrões do banco de dados devem ser excluídas e recriadas.

O conjunto de caracteres e a correção de dados do banco de dados são determinados pelo valor das variáveis de sistema `character_set_database` e `collation_database`. Para mais informações, consulte a Seção 10.3.3, “Conjunto de caracteres e correção de dados do banco de dados”.

### 13.1.17 Declaração de CREATE SERVER

```sql
CREATE SERVER server_name
    FOREIGN DATA WRAPPER wrapper_name
    OPTIONS (option [, option] ...)

option: {
    HOST character-literal
  | DATABASE character-literal
  | USER character-literal
  | PASSWORD character-literal
  | SOCKET character-literal
  | OWNER character-literal
  | PORT numeric-literal
}
```

Essa declaração cria a definição de um servidor para uso com o mecanismo de armazenamento `FEDERATED`. A declaração `CREATE SERVER` cria uma nova string na tabela `servers` no banco de dados `mysql`. Essa declaração requer o privilégio `SUPER`.

O `server_name` deve ser uma referência única ao servidor. As definições do servidor são globais no escopo do servidor, não é possível qualificar a definição do servidor para um banco de dados específico. `server_name` tem um comprimento máximo de 64 caracteres (os nomes mais longos que 64 caracteres são silenciosamente truncados) e é sensível a maiúsculas e minúsculas. Você pode especificar o nome como uma string citada.

O `wrapper_name` é um identificador e pode ser citado com aspas simples.

Para cada `option`, você deve especificar um literal de caractere ou um literal numérico. Os literais de caracteres são UTF-8, suportam um comprimento máximo de 64 caracteres e têm como padrão uma string em branco (vazia). Os literais de string são silenciosamente truncados para 64 caracteres. Os literais numéricos devem ser um número entre 0 e 9999, o valor padrão é 0.

Nota

A opção `OWNER` não é aplicada atualmente e não tem efeito sobre a propriedade ou operação da conexão do servidor que é criada.

A declaração `CREATE SERVER` cria uma entrada na tabela `mysql.servers` que pode ser usada posteriormente com a declaração `CREATE TABLE` ao criar uma tabela `FEDERATED`. As opções que você especifica são usadas para preencher as colunas na tabela `mysql.servers`. As colunas da tabela são `Server_name`, `Host`, `Db`, `Username`, `Password`, `Port` e `Socket`.

Por exemplo:

```sql
CREATE SERVER s
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'Remote', HOST '198.51.100.106', DATABASE 'test');
```

Certifique-se de especificar todas as opções necessárias para estabelecer uma conexão com o servidor. O nome de usuário, o nome do host e o nome do banco de dados são obrigatórios. Pode ser necessário outros tipos de opções, como senha.

Os dados armazenados na tabela podem ser utilizados ao criar uma conexão com uma tabela `FEDERATED`:

```sql
CREATE TABLE t (s1 INT) ENGINE=FEDERATED CONNECTION='s';
```

Para mais informações, consulte a Seção 15.8, “O motor de armazenamento FEDERATED”.

`CREATE SERVER` causa um commit implícito. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

`CREATE SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 13.1.18 Declaração CREATE TABLE

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
  | [CONSTRAINT [symbol]] PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | CHECK (expr)
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT default_value]
      [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [UNIQUE [KEY]] [[PRIMARY] KEY]
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
    table_option [[,] table_option] ...

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

Por padrão, as tabelas são criadas no banco de dados padrão, usando o mecanismo de armazenamento `InnoDB`. Um erro ocorre se a tabela existir, se não houver um banco de dados padrão ou se o banco de dados não existir.

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam as tabelas. Motores de armazenamento individuais podem impor restrições específicas do motor. `InnoDB` permite até 4 bilhões de tabelas.

Para informações sobre a representação física de uma tabela, consulte a Seção 13.1.18.1, “Arquivos criados por CREATE TABLE”.

Há vários aspectos da declaração `CREATE TABLE`, descritos nos seguintes tópicos desta seção:

* Nome da tabela
* Tabelas temporárias
* Clonagem e cópia de tabela
* Tipos e atributos de dados das colunas
* Índices e chaves estrangeiras
* Opções da tabela
* Partição da tabela

#### Nome da Tabela

* `tbl_name`

O nome da tabela pode ser especificado como *`db_name.tbl_name`* para criar a tabela em um banco de dados específico. Isso funciona independentemente de haver um banco de dados padrão, assumindo que o banco de dados exista. Se você usar identificadores com aspas, cite os nomes do banco de dados e da tabela separadamente. Por exemplo, escreva `` `mydb`.`mytbl` ``, not `` `mydb.mytbl` ``.

As regras para nomes de tabelas permitidos estão descritas na Seção 9.2, "Nomes de Objetos do Esquema".

* `IF NOT EXISTS`

Previne ocorrência de um erro se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica àquela indicada pela declaração `CREATE TABLE`.

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é descartada automaticamente quando a sessão é fechada. Para mais informações, consulte a Seção 13.1.18.2, “Declaração CREATE TABLE Temporária”.

#### Clonagem e cópia de tabela

* `LIKE`

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

  ```sql
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

Para mais informações, consulte a Seção 13.1.18.3, “Instrução CREATE TABLE ... LIKE”.

* `[AS] query_expression`

Para criar uma tabela a partir de outra, adicione uma declaração `SELECT` no final da declaração `CREATE TABLE`:

  ```sql
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

Para mais informações, consulte a Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”.

* `IGNORE | REPLACE`

As opções `IGNORE` e `REPLACE` indicam como lidar com strings que duplicam valores de chave única ao copiar uma tabela usando uma declaração `SELECT`.

Para mais informações, consulte a Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”.

#### Tipos de dados de coluna e atributos

Há um limite rígido de 4096 colunas por tabela, mas o máximo efetivo pode ser menor para uma tabela específica e depende dos fatores discutidos na Seção 8.4.7, “Limites do número de colunas e tamanho de string da tabela”.

* `data_type`

*`data_type`* representa o tipo de dados em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de coluna, bem como informações sobre as propriedades de cada tipo, consulte o Capítulo 11, *Tipos de Dados*.

+ Alguns atributos não se aplicam a todos os tipos de dados. `AUTO_INCREMENT` se aplica apenas aos tipos de número inteiro e ponto flutuante. `DEFAULT` não se aplica aos tipos `BLOB`, `TEXT`, `GEOMETRY` e `JSON`.

Os tipos de dados de caracteres (os tipos `CHAR`, `VARCHAR`, `TEXT`, `ENUM`, `SET` e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo de `CHARACTER SET`. Uma codificação para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para obter detalhes, consulte o Capítulo 10, *Conjunto de caracteres, Codificações, Unicode*. Exemplo:

    ```sql
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin);
    ```

O MySQL 5.7 interpreta as especificações de comprimento nas definições de colunas de caracteres em caracteres. As longitudes para `BINARY` e `VARBINARY` estão em bytes.

+ Para as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`, podem ser criados índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice. As colunas `BLOB` e `TEXT` também podem ser indexadas, mas *deve* ser dado um comprimento de prefixo. Os comprimentos de prefixo são dados em caracteres para tipos de string não binários e em bytes para tipos de string binários. Isso significa que as entradas do índice consistem nos primeiros *`length`* caracteres de cada valor de coluna para as colunas `CHAR`, `VARCHAR` e `TEXT`, e os primeiros *`length`* bytes de cada valor de coluna para as colunas `BINARY`, `VARBINARY` e `BLOB`. Indexar apenas um prefixo dos valores das colunas dessa forma pode tornar o arquivo de índice muito menor. Para informações adicionais sobre prefixos de índice, consulte a Seção 13.1.14, “Declaração CREATE INDEX”.

Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam indexação nas colunas `BLOB` e `TEXT`. Por exemplo:

    ```sql
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

A partir do MySQL 5.7.17, se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, o `CREATE TABLE` trata o índice da seguinte forma:

- Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dados da coluna e uma advertência é gerada (se o modo SQL rigoroso não estiver habilitado).

- Para um índice único, ocorre um erro, independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

As colunas `JSON` não podem ser indexadas. Você pode contornar essa restrição criando um índice em uma coluna gerada que extraia um valor escalar da coluna `JSON`. Consulte "Indexação de uma coluna gerada para fornecer um índice de coluna JSON", para um exemplo detalhado.

* `NOT NULL | NULL`

Se nem `NULL` nem `NOT NULL` for especificado, a coluna é tratada como se `NULL` tivesse sido especificado.

Em MySQL 5.7, apenas os motores de armazenamento `InnoDB`, `MyISAM` e `MEMORY` suportam índices em colunas que podem ter valores de `NULL`. Em outros casos, você deve declarar colunas indexadas como `NOT NULL` ou ocorrerá um erro.

* `DEFAULT`

Especifica um valor padrão para uma coluna. Para mais informações sobre o tratamento do valor padrão, incluindo o caso em que uma definição de coluna não inclui explicitamente o valor `DEFAULT`, consulte a Seção 11.6, “Valores padrão do tipo de dados”.

Se o modo SQL `NO_ZERO_DATE` ou `NO_ZERO_IN_DATE` estiver habilitado e um valor de data padrão não estiver correto de acordo com esse modo, o `CREATE TABLE` produz um aviso se o modo SQL rigoroso não estiver habilitado e um erro se o modo rigoroso estiver habilitado. Por exemplo, com `NO_ZERO_IN_DATE` habilitado, o `c1 DATE DEFAULT '2010-00-00'` produz um aviso.

* `AUTO_INCREMENT`

Uma coluna de número inteiro ou ponto flutuante pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor de `NULL` (recomendado) ou `0` em uma coluna indexada `AUTO_INCREMENT`, a coluna é definida para o próximo valor da sequência. Tipicamente, isso é `value+1`, onde *`value`* é o maior valor para a coluna atualmente na tabela. As sequências `AUTO_INCREMENT` começam com `1`.

Para recuperar um valor de `AUTO_INCREMENT` após inserir uma string, use a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Veja a Seção 12.15, “Funções de Informação”, e mysql\_insert\_id().

Se o modo SQL `NO_AUTO_VALUE_ON_ZERO` estiver habilitado, você pode armazenar `0` nas colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor de sequência. Veja a Seção 5.1.10, “Modos SQL do servidor”.

Só pode haver uma única coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver apenas valores positivos. Inserir um número negativo é considerado como inserir um número muito grande positivo. Isso é feito para evitar problemas de precisão quando os números "transbordam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

Para as tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma chave de múltiplos campos. Veja a Seção 3.6.9, “Usando AUTO\_INCREMENT”.

Para tornar o MySQL compatível com algumas aplicações ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última string inserida com a seguinte consulta:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

Este método exige que a variável `sql_auto_is_null` não esteja definida como 0. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Para informações sobre `InnoDB` e `AUTO_INCREMENT`, consulte a Seção 14.6.1.6, “Tratamento de AUTO\_INCREMENT em InnoDB”. Para informações sobre `AUTO_INCREMENT` e a Replicação do MySQL, consulte a Seção 16.4.1.1, “Replicação e AUTO\_INCREMENT”.

* `COMMENT`

Um comentário para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres. O comentário é exibido pelas declarações `SHOW CREATE TABLE` e `SHOW FULL COLUMNS`. Ele também é mostrado na coluna `COLUMN_COMMENT` do esquema de informações `COLUMNS` da tabela.

* `COLUMN_FORMAT`

No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais das tabelas `NDB` usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar armazenamento de largura fixa, `DYNAMIC` permite que a coluna seja de largura variável e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável, conforme determinado pelo tipo de dados da coluna (possivelmente sobrescrito por um especificador `ROW_FORMAT`).

Começando com o MySQL NDB Cluster 7.5.4, para as tabelas `NDB`, o valor padrão para `COLUMN_FORMAT` é `FIXED`. (O valor padrão havia sido alterado para `DYNAMIC` no MySQL NDB Cluster 7.5.1, mas essa alteração foi revertida para manter a compatibilidade reversa com as séries de lançamento GA existentes.) (Bug #24487363)

No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para mais informações e possíveis soluções, consulte a Seção 21.2.7.5, “Limites associados aos objetos de banco de dados no NDB Cluster”.

`COLUMN_FORMAT` atualmente não tem efeito sobre as colunas de tabelas que utilizam motores de armazenamento, exceto `NDB`. No MySQL 5.7 e versões posteriores, `COLUMN_FORMAT` é ignorado silenciosamente.

* `STORAGE`

Para as tabelas `NDB`, é possível especificar se a coluna é armazenada em disco ou na memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada em disco, e `STORAGE MEMORY` faz com que o armazenamento na memória seja usado. A declaração `CREATE TABLE` usada ainda deve incluir uma cláusula `TABLESPACE`:

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

Para as tabelas de `NDB`, `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

A cláusula `STORAGE` não tem efeito em tabelas que utilizam motores de armazenamento diferentes de `NDB`. A palavra-chave `STORAGE` é suportada apenas na versão do `mysqld` que é fornecida com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

* `GENERATED ALWAYS`

Usado para especificar uma expressão de coluna gerada. Para informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

As colunas geradas armazenadas podem ser indexadas. `InnoDB` suporta índices secundários em colunas geradas virtuais. Veja a Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

#### Índices e Chaves Estrangeiras

Vários termos-chave se aplicam à criação de índices e chaves estrangeiras. Para informações gerais, além das descrições a seguir, consulte a Seção 13.1.14, “Declaração CREATE INDEX”, e a Seção 13.1.18.5, “Restrições de chave estrangeira”.

* `CONSTRAINT symbol`

A cláusula `CONSTRAINT symbol` pode ser usada para nomear uma restrição. Se a cláusula não for fornecida, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de restrição, com a exceção mencionada abaixo. O valor *`symbol`*, se usado, deve ser único por esquema (banco de dados), por tipo de restrição. Um *`symbol`* duplicado resulta em um erro. Veja também a discussão sobre os limites de comprimento dos identificadores de restrição gerados na Seção 9.2.1, “Limites de comprimento do identificador”.

Nota

Se a cláusula `CONSTRAINT symbol` não for dada em uma definição de chave estrangeira, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o `NDB` usa o nome do índice da chave estrangeira.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo espaço de nomes. No MySQL, cada tipo de restrição tem seu próprio espaço de nomes por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema.

* `PRIMARY KEY`

Um índice único onde todas as colunas principais devem ser definidas como `NOT NULL`. Se elas não forem explicitamente declaradas como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas um `PRIMARY KEY`. O nome de um `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como o nome para qualquer outro tipo de índice.

Se você não tiver um `PRIMARY KEY` e um aplicativo solicitar o `PRIMARY KEY` em suas tabelas, o MySQL retorna o primeiro índice `UNIQUE` que não tenha colunas `NULL` como o `PRIMARY KEY`.

Nas tabelas `InnoDB`, mantenha o `PRIMARY KEY` curto para minimizar o overhead de armazenamento para índices secundários. Cada entrada de índice secundário contém uma cópia das colunas da chave primária para a string correspondente. (Veja a Seção 14.6.2.1, “Indekses agrupados e secundários”.)

Na tabela criada, um `PRIMARY KEY` é colocado primeiro, seguido de todos os índices `UNIQUE`, e depois os índices não exclusivos. Isso ajuda o otimizador do MySQL a priorizar qual índice usar e também a detectar mais rapidamente chaves duplicadas de `UNIQUE`.

Um `PRIMARY KEY` pode ser um índice de múltiplas colunas. No entanto, você não pode criar um índice de múltiplas colunas usando o atributo de chave `PRIMARY KEY` em uma especificação de coluna. Fazer isso apenas marca essa única coluna como primária. Você deve usar uma cláusula separada `PRIMARY KEY(key_part, ...)`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas instruções `SELECT`, conforme descrito em Índices Únicos.

Em MySQL, o nome de um `PRIMARY KEY` é `PRIMARY`. Para outros índices, se você não atribuir um nome, o índice recebe o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo único. Você pode ver os nomes dos índices de uma tabela usando `SHOW INDEX FROM tbl_name`. Veja a Seção 13.7.5.22, “Declaração SHOW INDEX”.

* `KEY | INDEX`

`KEY` é normalmente sinônimo de `INDEX`. O atributo chave `PRIMARY KEY` também pode ser especificado como apenas `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros sistemas de banco de dados.

* `UNIQUE`

Um índice `UNIQUE` cria uma restrição de tal forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova string com um valor de chave que corresponda a uma string existente. Para todos os motores, um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com um tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas declarações `SELECT`, conforme descrito em Índices Únicos.

* `FULLTEXT`

Um índice `FULLTEXT` é um tipo especial de índice usado para pesquisas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT`. Eles podem ser criados apenas a partir das colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna; a indexação de prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”, para detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um valor *`index_option`* para associar um plugin de análise a índice, se as operações de indexação e pesquisa de texto completo necessitarem de tratamento especial. Esta cláusula é válida apenas para índices `FULLTEXT`. Tanto `InnoDB` quanto `MyISAM` suportam plugins de análise de texto completo. Consulte Plugins de Análise de Texto Completo e Escrevendo Plugins de Análise de Texto Completo para mais informações.

* `SPATIAL`

Você pode criar índices `SPATIAL` em tipos de dados espaciais. Os tipos espaciais são suportados apenas para as tabelas `MyISAM` e `InnoDB`, e as colunas indexadas devem ser declaradas como `NOT NULL`. Veja a Seção 11.4, “Tipos de Dados Espaciais”.

* `FOREIGN KEY`

O MySQL suporta chaves estrangeiras, que permitem a referência cruzada de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter esses dados dispersos consistentes. Para informações sobre definição e opções, consulte *`reference_definition`* e *`reference_option`*.

As tabelas particionadas que utilizam o mecanismo de armazenamento `InnoDB` não suportam chaves estrangeiras. Consulte a Seção 22.6, “Restrições e Limitações na Particionamento”, para obter mais informações.

* `CHECK`

A cláusula `CHECK` é analisada, mas ignorada por todos os motores de armazenamento.

* `key_part`

Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões para especificar armazenamento de valor de índice ascendente ou descendente. Atualmente, elas são analisadas, mas ignoradas; os valores de índice são sempre armazenados em ordem ascendente.

Os prefixos, definidos pelo atributo *`length`*, podem ter até 767 bytes de comprimento para as tabelas `InnoDB` ou 3072 bytes se a opção `innodb_large_prefix` estiver habilitada. Para as tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes.

Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas declarações de `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

* `index_type`

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`.

Exemplo:

  ```sql
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
  ```

A posição preferida para `USING` é após a lista de colunas do índice. Ela pode ser dada antes da lista de colunas, mas o suporte para o uso da opção nessa posição é descontinuado; espere que ela seja removida em uma versão futura do MySQL.

* `index_option`

Os valores de *`index_option`* especificam opções adicionais para um índice.

+ `KEY_BLOCK_SIZE`

Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos da chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor do nível de tabela `KEY_BLOCK_SIZE`.

Para informações sobre o atributo `KEY_BLOCK_SIZE` de nível de tabela, consulte Opções de tabela.

+ `WITH PARSER`

A opção `WITH PARSER` pode ser usada apenas com índices `FULLTEXT`. Ela associa um plugin de análise de texto ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. Tanto `InnoDB` quanto `MyISAM` suportam plugins de análise de texto de texto completo. Se você tem uma tabela `MyISAM` com um plugin de análise de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

+ `COMMENT`

As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

Você pode definir o valor `InnoDB` para um índice individual usando a cláusula `MERGE_THRESHOLD`. Veja a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

Para mais informações sobre os valores *`index_option`* permitidos, consulte a Seção 13.1.14, “Instrução CREATE INDEX”. Para mais informações sobre índices, consulte a Seção 8.3.1, “Como o MySQL usa índices”.

* `reference_definition`

Para detalhes e exemplos de sintaxe de *`reference_definition`*, consulte a Seção 13.1.18.5, “Restrições de CHAVE ESTÁVEL”.

As tabelas `InnoDB` e `NDB` permitem a verificação de restrições de chave estrangeira. As colunas da tabela referenciada devem sempre ser explicitamente nomeadas. As ações `ON DELETE` e `ON UPDATE` sobre chaves estrangeiras são suportadas. Para informações mais detalhadas e exemplos, consulte a Seção 13.1.18.5, “Restrições de chave estrangeira”.

Para outros motores de armazenamento, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas declarações `CREATE TABLE`.

Importante

Para usuários familiarizados com o Padrão ANSI/ISO SQL, observe que nenhum mecanismo de armazenamento, incluindo `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada em definições de restrição de integridade referencial. O uso de uma cláusula explícita `MATCH` não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, especificar `MATCH` deve ser evitado.

A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma chave estrangeira composta (com várias colunas) são tratados ao serem comparados com uma chave primária. `InnoDB` implementa essencialmente a semântica definida por `MATCH SIMPLE`, que permite que uma chave estrangeira seja totalmente ou parcialmente `NULL`. Nesse caso, a string (da tabela filha) contendo tal chave estrangeira é permitida para ser inserida e não corresponde a nenhuma string na tabela referenciada (tabela pai). É possível implementar outras semânticas usando gatilhos.

Além disso, o MySQL exige que as colunas referenciadas estejam indexadas para desempenho. No entanto, `InnoDB` não exige que as colunas referenciadas sejam declaradas `UNIQUE` ou `NOT NULL`. O tratamento de referências de chave estrangeira para chaves não únicas ou chaves que contêm valores de `NULL` não está bem definido para operações como `UPDATE` ou `DELETE CASCADE`. Você é aconselhado a usar chaves estrangeiras que referenciem apenas chaves que sejam tanto `UNIQUE` (ou `PRIMARY`) e `NOT NULL`.

O MySQL analisa, mas ignora as especificações "inline `REFERENCES`" (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita as cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada. Para mais informações, consulte a Seção 1.6.2.3, "Diferenças da restrição FOREIGN KEY".

* `reference_option`

Para obter informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte a Seção 13.1.18.5, “Restrições de CHAVE ESTÁVEL”.

#### Opções de tabela

As opções de tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os motores de armazenamento, a menos que indicado de outra forma. Opções que não se aplicam a um determinado motor de armazenamento podem ser aceitas e lembradas como parte da definição da tabela. Essas opções, então, se aplicam se você usar posteriormente `ALTER TABLE` para converter a tabela para usar um motor de armazenamento diferente.

* `ENGINE`

Especifica o motor de armazenamento para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do motor pode ser não citado ou citado. O nome citado `'DEFAULT'` é reconhecido, mas ignorado.

  <table summary="Storage engine names permitted for the ENGINE table option and a description of each engine."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Storage Engine</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td>Tabelas seguras para transações com bloqueio de string e chaves externas. O mecanismo de armazenamento padrão para novas tabelas. Veja o Capítulo 14.<i>O motor de armazenamento InnoDB</i>, e, em particular, a Seção 14.1, “Introdução ao InnoDB”, se você tem experiência com MySQL, mas é novo<code>InnoDB</code>.</td> </tr><tr> <td><code>MyISAM</code></td> <td>O motor de armazenamento portátil binário que é utilizado principalmente para cargas de trabalho de leitura somente ou de leitura predominantemente. Veja a Seção 15.2, “O motor de armazenamento MyISAM”.</td> </tr><tr> <td><code>MEMORY</code></td> <td>Os dados deste motor de armazenamento são armazenados apenas na memória. Veja a Seção 15.3, “O Motor de Armazenamento de MEMÓRIA”.</td> </tr><tr> <td><code>CSV</code></td> <td>Tabelas que armazenam strings em formato de valores separados por vírgula. Veja a Seção 15.4, “O mecanismo de armazenamento CSV”.</td> </tr><tr> <td><code>ARCHIVE</code></td> <td>O mecanismo de armazenamento de arquivamento. Veja a Seção 15.5, “O Mecanismo de Armazenamento ARCHIVE”.</td> </tr><tr> <td><code>EXAMPLE</code></td> <td>Um exemplo de motor. Veja a Seção 15.9, “O MOTOR DE Armazenamento EXAMPLE”.</td> </tr><tr> <td><code>FEDERATED</code></td> <td>Motor de armazenamento que acessa tabelas remotas. Veja a Seção 15.8, “O Motor de Armazenamento FEDERATED”.</td> </tr><tr> <td><code>HEAP</code></td> <td>Isto é sinônimo de<code>MEMORY</code>.</td> </tr><tr> <td><code>MERGE</code></td> <td>Uma coleção de<code>MyISAM</code>mesas usadas como uma mesa. Também conhecidas como<code>MRG_MyISAM</code>Veja a Seção 15.7, “O Motor de Armazenamento MERGE”.</td> </tr><tr> <td><code>NDB</code></td> <td>Tabelas agrupadas, tolerantes a falhas, baseadas em memória, que suportam transações e chaves estrangeiras. Também conhecidas como<code>NDBCLUSTER</code>Veja o Capítulo 21.<i>MySQL NDB Cluster 7.5 e NDB Cluster 7.6</i>.</td> </tr></tbody></table>

Por padrão, se um mecanismo de armazenamento for especificado que não está disponível, a declaração falha com um erro. Você pode sobrepor esse comportamento removendo `NO_ENGINE_SUBSTITUTION` do modo SQL do servidor (consulte Seção 5.1.10, “Modos SQL do servidor”) para que o MySQL permita a substituição do mecanismo especificado pelo mecanismo de armazenamento padrão, em vez disso. Normalmente, em tais casos, isso é `InnoDB`, que é o valor padrão para a variável de sistema `default_storage_engine`. Quando `NO_ENGINE_SUBSTITUTION` é desativado, uma mensagem de aviso ocorre se a especificação do mecanismo de armazenamento não for respeitada.

* `AUTO_INCREMENT`

O valor inicial `AUTO_INCREMENT` para a tabela. No MySQL 5.7, isso funciona para as tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor de auto-incremento para motores que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma string “falsa” com um valor menor que o desejado após a criação da tabela, e depois exclua a string falsa.

Para motores que suportam a opção da tabela `AUTO_INCREMENT` nas declarações de `CREATE TABLE`, você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor de `AUTO_INCREMENT`. O valor não pode ser definido como menor que o valor máximo atualmente na coluna.

* `AVG_ROW_LENGTH`

Uma aproximação do comprimento médio da string para sua tabela. Você precisa definir isso apenas para tabelas grandes com strings de tamanho variável.

Quando você cria uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir quão grande será a tabela resultante. Se você não especificar nenhuma dessas opções, o tamanho máximo para os arquivos de dados e índice `MyISAM` é 256TB por padrão. (Se o seu sistema operacional não suporta arquivos desse tamanho, os tamanhos das tabelas são limitados pelo limite de tamanho do arquivo.) Se você deseja manter os tamanhos dos ponteiros baixos para fazer o índice menor e mais rápido e não precisa realmente de grandes arquivos, você pode diminuir o tamanho padrão do ponteiro definindo a variável de sistema `myisam_data_pointer_size`. (Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.) Se você deseja que todas as suas tabelas possam crescer acima do limite padrão e está disposto a ter suas tabelas ligeiramente mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro definindo essa variável. Definir o valor para 7 permite tamanhos de tabela de até 65.536TB.

* `[DEFAULT] CHARACTER SET`

Especifica um conjunto de caracteres padrão para a tabela. `CHARSET` é sinônimo de `CHARACTER SET`. Se o nome do conjunto de caracteres for `DEFAULT`, o conjunto de caracteres do banco de dados é usado.

* `CHECKSUM`

Defina este valor em 1 se quiser que o MySQL mantenha um checksum em tempo real para todas as strings (ou seja, um checksum que o MySQL atualiza automaticamente à medida que a tabela muda). Isso torna a tabela um pouco mais lenta para atualização, mas também facilita a localização de tabelas corrompidas. A declaração `CHECKSUM TABLE` relata o checksum. (Apenas `MyISAM`.)

* `[DEFAULT] COLLATE`

Especifica uma agregação padrão para a tabela.

* `COMMENT`

Um comentário para a tabela, com até 2048 caracteres.

Você pode definir o valor `InnoDB` `MERGE_THRESHOLD` para uma tabela usando a cláusula `table_option` `COMMENT`. Veja a Seção 14.8.12, “Configurando o Limite de Fusão para Páginas de Índice”.

**Definindo as opções da NDB\_TABLE.**

No MySQL NDB Cluster 7.5.2 e versões posteriores, o comentário da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar de um a quatro dos `NDB_TABLE` opções `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED` como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a string `NDB_TABLE=` que começa o texto do comentário citado. Um exemplo de declaração usando essa sintaxe é mostrado aqui (texto destacado):

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

Espaços não são permitidos na string citada. A string é sensível a maiúsculas e minúsculas.

O comentário é exibido como parte do resultado do `SHOW CREATE TABLE`. O texto do comentário também está disponível como a coluna TABLE_COMMENT da tabela Schema de Informações MySQL `TABLES`.

Essa sintaxe de comentário também é suportada com declarações `ALTER TABLE` para tabelas `NDB`. Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter tido anteriormente.

Definir a opção `MERGE_THRESHOLD` nos comentários da tabela não é suportada para as tabelas `NDB` (é ignorada).

Para informações completas sobre sintaxe e exemplos, consulte a Seção 13.1.18.9, “Definindo opções de comentário NDB”.

* `COMPRESSION`

O algoritmo de compressão utilizado para compressão de nível de página para as tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com a característica de compressão transparente de página. A compressão de página só é suportada com tabelas `InnoDB` que residem em espaços de tabela por arquivo, e está disponível apenas em plataformas Linux e Windows que suportam arquivos esparsos e perfuração de buracos. Para mais informações, consulte a Seção 14.9.2, “Compressão de Página InnoDB”.

* `CONNECTION`

A cadeia de conexão para uma tabela `FEDERATED`.

Nota

Versões mais antigas do MySQL usavam uma opção `COMMENT` para a string de conexão.

* `DATA DIRECTORY`, `INDEX DIRECTORY`

Para `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite a criação de uma tabela fora do diretório de dados. A variável `innodb_file_per_table` deve ser habilitada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado. Para mais informações, consulte a Seção 14.6.1.2, “Criando tabelas externamente”.

Ao criar as tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de índice da tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondem ao nome do banco de dados ao criar uma tabela `MyISAM` com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

A partir do MySQL 5.7.17, você deve ter o privilégio `FILE` para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

Importante

As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas para tabelas particionadas. (Bug #32091)

Essas opções funcionam apenas quando você não está usando a opção `--skip-symbolic-links`. Seu sistema operacional também deve ter uma chamada `realpath()` segura e compatível com o uso de múltiplos threads. Consulte a Seção 8.12.3.2, “Usando Links Simbólicos para Tabelas MyISAM em Unix”, para obter informações mais completas.

Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se o `MyISAM` encontrar um arquivo existente `.MYD` neste caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção `--keep_files_on_create`, caso em que o `MyISAM` não sobrescreverá os arquivos existentes e retornará um erro em vez disso.

Se uma tabela `MyISAM` for criada com uma opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo existente `.MYD` ou `.MYI` for encontrado, o MyISAM sempre retorna um erro. Não sobrescreve um arquivo no diretório especificado.

Importante

Você não pode usar nomes de caminho que contenham o diretório de dados MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e particionamentos de tabelas individuais. (Veja o Bug #32167.)

* `DELAY_KEY_WRITE`

Defina este valor em 1 se deseja adiar as atualizações principais da tabela até que a tabela seja fechada. Consulte a descrição da variável de sistema `delay_key_write` na Seção 5.1.7, “Variáveis do sistema do servidor”. (Apenas `MyISAM`).

* `ENCRYPTION`

Defina a opção `ENCRYPTION` para `'Y'` para habilitar a criptografia de dados em nível de página para uma tabela `InnoDB` criada em um espaço de tabelas por arquivo. Os valores das opções não são sensíveis ao caso. A opção `ENCRYPTION` foi introduzida com a característica de criptografia de espaço de tabelas `InnoDB`; consulte Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”. Um plugin `keyring` deve ser instalado e configurado antes que a criptografia possa ser habilitada.

A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se o motor de armazenamento padrão for `InnoDB`, ou se a declaração `CREATE TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a declaração é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

* `INSERT_METHOD`

Se você deseja inserir dados em uma tabela `MERGE`, deve especificar com `INSERT_METHOD` a tabela na qual a string deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use um valor de `FIRST` ou `LAST` para que as inserções sejam feitas na primeira ou última tabela, ou um valor de `NO` para impedir inserções. Veja a Seção 15.7, “O Motor de Armazenamento MERGE”.

* `KEY_BLOCK_SIZE`

Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos da chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui o valor do nível de tabela `KEY_BLOCK_SIZE`.

Para as tabelas de `InnoDB`, `KEY_BLOCK_SIZE` especifica o tamanho da página em kilobytes a ser usado para as tabelas comprimidas de `InnoDB`. O valor de `KEY_BLOCK_SIZE` é tratado como um indicativo; um tamanho diferente pode ser usado por `InnoDB`, se necessário. `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor de `innodb_page_size`. Um valor de 0 representa o tamanho de página comprimida padrão, que é metade do valor de `innodb_page_size`. Dependendo de `innodb_page_size`, os possíveis valores de `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Consulte a Seção 14.9.1, “Compressão de Tabela InnoDB”, para obter mais informações.

A Oracle recomenda habilitar `innodb_strict_mode` ao especificar `KEY_BLOCK_SIZE` para tabelas de `InnoDB`. Quando `innodb_strict_mode` está habilitado, especificar um valor inválido de `KEY_BLOCK_SIZE` retorna um erro. Se `innodb_strict_mode` estiver desativado, um valor inválido de `KEY_BLOCK_SIZE` resulta em um aviso, e a opção `KEY_BLOCK_SIZE` é ignorada.

A coluna `Create_options`, em resposta a `SHOW TABLE STATUS`, reporta a opção `KEY_BLOCK_SIZE` especificada originalmente, assim como a coluna `SHOW CREATE TABLE`.

`InnoDB` só suporta `KEY_BLOCK_SIZE` no nível de tabela.

`KEY_BLOCK_SIZE` não é suportado com valores de `innodb_page_size` de 32KB e 64KB. A compressão da tabela `InnoDB` não suporta esses tamanhos de página.

* `MAX_ROWS`

O número máximo de strings que você planeja armazenar na tabela. Esse não é um limite rígido, mas sim uma dica para o mecanismo de armazenamento de que a tabela deve ser capaz de armazenar pelo menos esse número de strings.

Importante

O uso de `MAX_ROWS` com as tabelas `NDB` para controlar o número de partições de tabela é descontinuado a partir do NDB Cluster 7.5.4. Ele ainda é suportado em versões posteriores para compatibilidade reversa, mas está sujeito à remoção em uma versão futura. Use PARTITION\_BALANCE em vez disso; veja Configurando opções NDB_TABLE.

O motor de armazenamento `NDB` trata esse valor como máximo. Se você planeja criar tabelas muito grandes do NDB Cluster (contendo milhões de strings), você deve usar essa opção para garantir que `NDB` aloque um número suficiente de slots de índice na tabela hash usada para armazenar os hashes das chaves primárias da tabela, definindo `MAX_ROWS = 2 * rows`, onde *`rows`* é o número de strings que você espera inserir na tabela.

O valor máximo do `MAX_ROWS` é 4294967295; valores maiores são truncados até esse limite.

* `MIN_ROWS`

O número mínimo de strings que você planeja armazenar na tabela. O mecanismo de armazenamento `MEMORY` usa essa opção como uma dica sobre o uso de memória.

* `PACK_KEYS`

É eficaz apenas com as tabelas `MyISAM`. Defina esta opção para 1 se desejar índices menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção para 0 desativa todos os pacotes de chaves. Definir para `DEFAULT` indica ao motor de armazenamento que apenas pacotes colunas longas `CHAR`, `VARCHAR`, `BINARY` ou `VARBINARY` são pacotadas.

Se você não usar `PACK_KEYS`, o padrão é embalar strings, mas não números. Se você usar `PACK_KEYS=1`, os números também são embalados.

Ao embalar chaves de número binário, o MySQL usa compressão prefixada:

+ Cada chave precisa de um byte extra para indicar quantos bytes da chave anterior são iguais para a próxima chave.

+ O ponteiro para a string é armazenado em ordem de alto byte primeiro, diretamente após a chave, para melhorar a compressão.

Isso significa que, se você tiver muitas chaves iguais em duas strings consecutivas, todas as chaves seguintes geralmente levam apenas dois bytes (incluindo o ponteiro para a string). Compare isso com o caso comum em que as chaves seguintes levam `storage_size_for_key + pointer_size` (onde o tamanho do ponteiro geralmente é 4). Por outro lado, você obtém um benefício significativo da compressão prefixal apenas se tiver muitas números iguais. Se todas as chaves forem totalmente diferentes, você usa um byte a mais por chave, se a chave não for uma chave que pode ter valores de `NULL` (Neste caso, o comprimento da chave compactada é armazenado no mesmo byte que é usado para marcar se uma chave é `NULL`.).

* `PASSWORD`

Esta opção não é utilizada. Se você precisa embaralhar seus arquivos `.frm` e torná-los inutilizáveis para qualquer outro servidor MySQL, entre em contato com nosso departamento de vendas.

* `ROW_FORMAT`

Define o formato físico no qual as strings são armazenadas.

Ao criar uma tabela com o modo estrito desativado, o formato de string padrão do mecanismo de armazenamento é usado se o formato de string especificado não for suportado. O formato de string real da tabela é relatado na coluna `Row_format` em resposta ao `SHOW TABLE STATUS`. A coluna `Create_options` mostra o formato de string que foi especificado na declaração `CREATE TABLE`, assim como o `SHOW CREATE TABLE`.

As opções de formato de string variam dependendo do mecanismo de armazenamento utilizado para a tabela.

Para as tabelas de `InnoDB`:

+ O formato de string padrão é definido por `innodb_default_row_format`, que tem um ajuste padrão de `DYNAMIC`. O formato de string padrão é usado quando a opção `ROW_FORMAT` não é definida ou quando `ROW_FORMAT=DEFAULT` é usado.

Se a opção `ROW_FORMAT` não for definida, ou se `ROW_FORMAT=DEFAULT` for usada, as operações que reconstroem uma tabela também alteram silenciosamente o formato da string da tabela para o padrão definido por `innodb_default_row_format`. Para mais informações, consulte Definindo o Formato da String de uma Tabela.

+ Para um armazenamento mais eficiente dos tipos de dados, especialmente os tipos `BLOB`, use o `DYNAMIC`. Veja o Formato Dinâmico de String para requisitos associados ao formato de string `DYNAMIC`.

+ Para habilitar a compressão para as tabelas `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. Consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”, para requisitos associados ao formato da string `COMPRESSED`.

+ O formato de string usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o formato de string `REDUNDANT`.

+ Quando especificar uma cláusula não padrão do `ROW_FORMAT`, considere também habilitar a opção de configuração do [[`innodb_strict_mode`].

+ `ROW_FORMAT=FIXED` não é suportado. Se `ROW_FORMAT=FIXED` é especificado enquanto `innodb_strict_mode` está desativado, `InnoDB` emite um aviso e assume `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` é especificado enquanto `innodb_strict_mode` está habilitado, que é o padrão, `InnoDB` retorna um erro.

+ Para informações adicionais sobre os formatos de string do registro `InnoDB`, consulte a Seção 14.11, “Formatos de string do InnoDB”.

Para as tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para formato de string estático ou de comprimento variável. **myisampack** define o tipo como `COMPRESSED`. Veja a Seção 15.2.3, “Formatos de Armazenamento de Tabela MyISAM”.

Para as tabelas `NDB`, o padrão `ROW_FORMAT` no MySQL NDB Cluster 7.5.1 e versões posteriores é `DYNAMIC`. (Anteriormente, era `FIXED`.

* `STATS_AUTO_RECALC`

Especifica se deseja recalcular automaticamente as estatísticas persistentes para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste das estatísticas persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_auto_recalc`. O valor `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados na tabela forem alterados. O valor `0` impede a recálculo automático para esta tabela; com este ajuste, emita uma declaração `ANALYZE TABLE` para recálculo das estatísticas após fazer alterações substanciais na tabela. Para mais informações sobre o recurso de estatísticas persistentes, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

* `STATS_PERSISTENT`

Especifica se habilitar estatísticas persistentes para uma tabela `InnoDB`. O valor `DEFAULT` faz com que o ajuste de estatísticas persistentes para a tabela seja determinado pela opção de configuração `innodb_stats_persistent`. O valor `1` habilita estatísticas persistentes para a tabela, enquanto o valor `0` desativa essa funcionalidade. Após habilitar estatísticas persistentes por meio de uma declaração `CREATE TABLE` ou `ALTER TABLE`, emita uma declaração `ANALYZE TABLE` para calcular as estatísticas, após carregar dados representativos na tabela. Para mais informações sobre a funcionalidade de estatísticas persistentes, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Optimizer Pessoalizado”.

* `STATS_SAMPLE_PAGES`

O número de páginas de índice a serem amostradas ao estimar a cardinalidade e outras estatísticas para uma coluna indexada, como as calculadas por `ANALYZE TABLE`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

* `TABLESPACE`

A cláusula `TABLESPACE` pode ser usada para criar uma tabela `InnoDB` em um espaço de tabelas geral existente, um espaço de tabelas por arquivo ou o espaço de tabelas do sistema.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

O espaço de tabela geral que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para informações sobre espaços de tabela gerais, consulte a Seção 14.6.3.3, “Espaços de tabela geral”.

O `tablespace_name` é um identificador sensível a maiúsculas e minúsculas. Ele pode ser citado ou não citado. O caractere lombo ("/") não é permitido. Os nomes que começam com "innodb_" são reservados para uso especial.

Para criar uma tabela no espaço de tabelas do sistema, especifique `innodb_system` como o nome do espaço de tabelas.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

Usando `TABLESPACE [=] innodb_system`, você pode colocar uma tabela de qualquer formato de string não compactada no espaço de tabelas do sistema, independentemente da configuração do `innodb_file_per_table`. Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao espaço de tabelas do sistema usando `TABLESPACE [=] innodb_system`.

Para criar uma tabela em um espaço de tabela por arquivo, especifique `innodb_file_per_table` como o nome do espaço de tabela.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

Nota

Se `innodb_file_per_table` estiver habilitado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um espaço de tabela por tabela `InnoDB`. As tabelas `InnoDB` são criadas em espaços de tabela por tabela por padrão quando `innodb_file_per_table` está habilitado.

Nota

O suporte para a criação de partições de tabela em espaços de `InnoDB` compartilhados é descontinuado no MySQL 5.7.24; espera-se que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais.

A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas, de outra forma, não é suportada para uso em combinação com a opção `TABLESPACE`.

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` é descontinuado a partir do MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL.

A opção de tabela `STORAGE` é empregada apenas com as tabelas `NDB`. `STORAGE` determina o tipo de armazenamento utilizado e pode ser de `DISK` ou `MEMORY`.

`TABLESPACE ... STORAGE DISK` atribui uma tabela a um espaço de dados de disco de NDB Cluster. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por *`TABLESPACE` *`tablespace_name`*.

Para `STORAGE MEMORY`, o nome do tablespace é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está em memória.

Consulte a Seção 21.6.11, “Tabelas de dados de disco do cluster NDB”, para obter mais informações.

* `UNION`

Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma única entidade. Isso funciona apenas com tabelas `MERGE`. Veja a Seção 15.7, “O Motor de Armazenamento MERGE”.

Você deve ter os privilégios `SELECT`, `UPDATE` e `DELETE` para as tabelas que você mapeia para uma tabela `MERGE`.

Nota

Anteriormente, todas as tabelas utilizadas tinham que estar no mesmo banco de dados que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Partição de tabela

*`partition_options`* pode ser usado para controlar a partição da tabela criada com `CREATE TABLE`.

Nem todas as opções exibidas na sintaxe para *`partition_options`* no início desta seção estão disponíveis para todos os tipos de particionamento. Consulte as listas dos seguintes tipos individuais para informações específicas a cada tipo, e consulte o Capítulo 22, *Particionamento*, para obter informações mais completas sobre o funcionamento e os usos do particionamento no MySQL, bem como exemplos adicionais de criação de tabelas e outras declarações relacionadas ao particionamento do MySQL.

As partições podem ser modificadas, unidas, adicionadas a tabelas e removidas de tabelas. Para informações básicas sobre as declarações MySQL para realizar essas tarefas, consulte a Seção 13.1.8, “Declaração ALTER TABLE”. Para descrições e exemplos mais detalhados, consulte a Seção 22.3, “Gestão de Partições”.

* `PARTITION BY`

Se utilizada, uma cláusula *`partition_options`* começa com `PARTITION BY`. Esta cláusula contém a função que é usada para determinar a partição; a função retorna um valor inteiro variando de 1 a *`num`*, onde *`num`* é o número de partições. (O número máximo de partições definidas pelo usuário que uma tabela pode conter é 1024; o número de subpartições—discutido mais tarde nesta seção—está incluído neste máximo.)

Nota

A expressão (*`expr`*) usada em uma cláusula `PARTITION BY` não pode se referir a quaisquer colunas que não estejam na tabela que está sendo criada; tais referências não são especificamente permitidas e causam o erro na declaração. (Bug #29444)

* `HASH(expr)`

Hashar uma ou mais colunas para criar uma chave para posicionar e localizar strings. *`expr`* é uma expressão que usa uma ou mais colunas da tabela. Isso pode ser qualquer expressão válida do MySQL (incluindo funções do MySQL) que produza um único valor inteiro. Por exemplo, estas são ambas as declarações válidas `CREATE TABLE` usando `PARTITION BY HASH`:

  ```sql
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

Você não pode usar nenhuma das cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

`PARTITION BY HASH` utiliza o resto de *`expr`* dividido pelo número de partições (ou seja, o módulo). Para exemplos e informações adicionais, consulte a Seção 22.2.4, “Partitionamento HASH”.

A palavra-chave `LINEAR` implica em um algoritmo um pouco diferente. Neste caso, o número da partição na qual uma string é armazenada é calculado como o resultado de uma ou mais operações lógicas `AND`. Para discussão e exemplos de hashing linear, consulte a Seção 22.2.4.1, “Partitionamento de Hash Linear”.

* `KEY(column_list)`

Isso é semelhante ao `HASH`, exceto que o MySQL fornece a função de hashing para garantir uma distribuição de dados uniforme. O argumento *`column_list`* é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples dividida por chave, com 4 partições:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

Para tabelas que são particionadas por chave, você pode empregar particionamento linear usando a palavra-chave `LINEAR`. Isso tem o mesmo efeito que com tabelas que são particionadas por `HASH`. Ou seja, o número da partição é encontrado usando o operador `&` em vez do módulo (consulte a Seção 22.2.4.1, “Particionamento HASH Linear”, e a Seção 22.2.5, “Particionamento por Chave”, para detalhes). Este exemplo usa particionamento linear por chave para distribuir dados entre 5 partições:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

A opção `ALGORITHM={1 | 2}` é compatível com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de hashing de chave que o MySQL 5.1; `ALGORITHM=2` significa que o servidor emprega as funções de hashing de chave usadas por padrão para novas tabelas particionadas `KEY` no MySQL 5.7 e versões posteriores. Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção é destinada principalmente para uso quando se está atualizando tabelas particionadas `[LINEAR] KEY` do MySQL 5.1 para versões posteriores do MySQL. Para mais informações, consulte a Seção 13.1.8.1, “Operações de Partição de Tabela”.

O **mysqldump** escreve essa opção em comentários versionados, assim:

  ```sql
  CREATE TABLE t1 (a INT)
  /*!50100 PARTITION BY KEY */ /*!50611 ALGORITHM = 1 */ /*!50100 ()
        PARTITIONS 3 */
  ```

Isso faz com que os servidores MySQL 5.6.10 e anteriores ignorem a opção, o que, de outra forma, causaria um erro de sintaxe nessas versões.

`ALGORITHM=1` é mostrado quando necessário na saída de `SHOW CREATE TABLE`, usando comentários versionados da mesma maneira que o **mysqldump**. `ALGORITHM=2` é sempre omitido na saída de `SHOW CREATE TABLE`, mesmo que essa opção tenha sido especificada ao criar a tabela original.

Você não pode usar nenhuma das cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY KEY`.

* `RANGE(expr)`

Neste caso, *`expr`* exibe uma faixa de valores usando um conjunto de operadores `VALUES LESS THAN`. Ao usar a partição de faixa, você deve definir pelo menos uma partição usando `VALUES LESS THAN`. Não é possível usar `VALUES IN` com partição de faixa.

Nota

Para tabelas particionadas por `RANGE`, `VALUES LESS THAN` deve ser usado com um valor literal inteiro ou uma expressão que avalie a um único valor inteiro. No MySQL 5.7, você pode superar essa limitação em uma tabela que é definida usando `PARTITION BY RANGE COLUMNS`, conforme descrito mais adiante nesta seção.

Suponha que você tenha uma tabela que deseja particionar em uma coluna contendo valores de ano, de acordo com o esquema a seguir.

  <table summary="A table partitioning scheme based on a column containing year values, as described in the preceding text. The table lists partition numbers and corresponding range of years."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Partition Number:</th> <th>Ano de produção:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 e anteriores</td> </tr><tr> <td>1</td> <td>1991 a 1994</td> </tr><tr> <td>2</td> <td>1995 a 1998</td> </tr><tr> <td>3</td> <td>1999 a 2002</td> </tr><tr> <td>4</td> <td>2003 a 2005</td> </tr><tr> <td>5</td> <td>2006 e posterior</td> </tr></tbody></table>

Uma tabela que implemente um esquema de particionamento desse tipo pode ser realizada pela declaração `CREATE TABLE` mostrada aqui:

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

As declarações `PARTITION ... VALUES LESS THAN ...` funcionam de forma consecutiva. `VALUES LESS THAN MAXVALUE` trabalha para especificar valores "remanescentes" que são maiores que o valor máximo especificado de outra forma.

As cláusulas `VALUES LESS THAN` funcionam sequencialmente de uma maneira semelhante à das partes `case` de um bloco `switch ... case` (como encontrado em muitos linguagens de programação, como C, Java e PHP). Isso significa que as cláusulas devem ser organizadas de tal forma que o limite superior especificado em cada `VALUES LESS THAN` sucessivo seja maior que o do anterior, com a que referencia `MAXVALUE` sendo a última de todas na lista.

* `RANGE COLUMNS(column_list)`

Esta variante do `RANGE` facilita o recorte de partições para consultas que utilizam condições de intervalo em várias colunas (ou seja, com condições como `WHERE a = 1 AND b < 10` ou `WHERE a = 1 AND b = 10 AND c < 10`). Permite que você especifique intervalos de valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES LESS THAN (value_list)`. (No caso mais simples, este conjunto consiste em uma única coluna.) O número máximo de colunas que podem ser referenciadas nos *`column_list`* e *`value_list`* é 16.

O *`column_list` utilizado na cláusula `COLUMNS` pode conter apenas nomes de colunas; cada coluna na lista deve ser um dos seguintes tipos de dados do MySQL: os tipos de inteiro; os tipos de cadeia; e os tipos de coluna de hora ou data. Colunas que utilizam `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT` ou tipos de dados espaciais não são permitidas; colunas que utilizam tipos de número de ponto flutuante também não são permitidas. Além disso, você não pode usar funções ou expressões aritméticas na cláusula `COLUMNS`.

A cláusula `VALUES LESS THAN` usada em uma definição de partição deve especificar um valor literal para cada coluna que aparece na cláusula `COLUMNS()`; ou seja, a lista de valores usada para cada cláusula `VALUES LESS THAN` deve conter o mesmo número de valores que o número de colunas listadas na cláusula `COLUMNS`. Uma tentativa de usar mais ou menos valores em uma cláusula `VALUES LESS THAN` do que o número de valores na cláusula `COLUMNS` causa a declaração falhar com o erro Incoerência no uso de listas de colunas para particionamento.... Não é possível usar `NULL` para qualquer valor que apareça em `VALUES LESS THAN`. É possível usar `MAXVALUE` mais de uma vez para uma coluna dada, exceto a primeira, como mostrado neste exemplo:

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

Cada valor utilizado em uma lista de valores de `VALUES LESS THAN` deve corresponder exatamente ao tipo da coluna correspondente; nenhuma conversão é feita. Por exemplo, você não pode usar a string `'1'` para um valor que corresponda a uma coluna que usa um tipo de número inteiro (você deve usar o numeral `1` em vez disso), e também não pode usar o numeral `1` para um valor que corresponda a uma coluna que usa um tipo de string (nesse caso, você deve usar uma string citada: `'1'`).

Para mais informações, consulte a Seção 22.2.1, “Particionamento de RANG”, e a Seção 22.4, “Rutura de Partição”.

* `LIST(expr)`

Isso é útil ao atribuir partições com base em uma coluna de tabela com um conjunto restrito de valores possíveis, como um código de estado ou país. Nesse caso, todas as strings relacionadas a um determinado estado ou país podem ser atribuídas a uma única partição, ou uma partição pode ser reservada para um determinado conjunto de estados ou países. É semelhante ao `RANGE`, exceto que apenas `VALUES IN` pode ser usado para especificar valores permitidos para cada partição.

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

Para tabelas particionadas por `LIST`, a lista de valores usada com `VALUES IN` deve consistir apenas em valores inteiros. No MySQL 5.7, você pode superar essa limitação usando a particionamento por `LIST COLUMNS`, que é descrito mais tarde nesta seção.

* `LIST COLUMNS(column_list)`

Esta variante do `LIST` facilita o recorte de partições para consultas que utilizam condições de comparação em várias colunas (ou seja, com condições como `WHERE a = 5 AND b = 5` ou `WHERE a = 1 AND b = 10 AND c = 5`). Permite especificar valores em várias colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de partição `PARTITION ... VALUES IN (value_list)`.

As regras que regem os tipos de dados para a lista de colunas usadas em `LIST COLUMNS(column_list)` e a lista de valores usada em `VALUES IN(value_list)` são as mesmas que as usadas para a lista de colunas em `RANGE COLUMNS(column_list)` e a lista de valores em `VALUES LESS THAN(value_list)`, respectivamente, exceto que na cláusula de `VALUES IN`, `MAXVALUE` não é permitido e você pode usar `NULL`.

Há uma diferença importante entre a lista de valores usada para `VALUES IN` em oposição a quando é usada com `PARTITION BY LIST COLUMNS`, em oposição a quando é usada com `PARTITION BY LIST`. Quando usada com `PARTITION BY LIST COLUMNS`, cada elemento na cláusula `VALUES IN` deve ser um *conjunto* de valores de coluna; o número de valores em cada conjunto deve ser o mesmo número de colunas usadas na cláusula `COLUMNS`, e os tipos de dados desses valores devem corresponder aos tipos das colunas (e ocorrer no mesmo ordem). No caso mais simples, o conjunto consiste em uma única coluna. O número máximo de colunas que podem ser usadas no *`column_list`* e nos elementos que compõem o *`value_list`* é 16.

A tabela definida pela seguinte declaração `CREATE TABLE` fornece um exemplo de uma tabela que utiliza a partição `LIST COLUMNS`:

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

* `PARTITIONS num`

O número de partições pode ser especificado opcionalmente com uma cláusula `PARTITIONS num`, onde *`num`* é o número de partições. Se ambas as cláusulas *e* quaisquer cláusulas `PARTITION` forem usadas, *`num`* deve ser igual ao número total de quaisquer partições declaradas usando cláusulas `PARTITION`.

Nota

Se você usa ou não uma cláusula `PARTITIONS` ao criar uma tabela que é particionada por `RANGE` ou `LIST`, você ainda deve incluir pelo menos uma cláusula `PARTITION VALUES` na definição da tabela (veja abaixo).

* `SUBPARTITION BY`

Uma partição pode ser dividida opcionalmente em vários subpartições. Isso pode ser indicado usando a cláusula opcional `SUBPARTITION BY`. A subpartição pode ser feita por `HASH` ou `KEY`. Qualquer uma dessas pode ser `LINEAR`. Essas funcionam da mesma maneira que as descritas anteriormente para os tipos de partição equivalentes. (Não é possível subpartição por `LIST` ou `RANGE`).

O número de subdivisões pode ser indicado usando a palavra-chave `SUBPARTITIONS` seguida de um valor numérico.

* É aplicada uma verificação rigorosa do valor utilizado nas cláusulas `PARTITIONS` ou `SUBPARTITIONS`, e esse valor deve atender às seguintes regras:

+ O valor deve ser um número inteiro positivo e não nulo.
+ Não são permitidas zeros no início.
+ O valor deve ser um literal inteiro e não pode ser uma expressão. Por exemplo, `PARTITIONS 0.2E+01` não é permitido, embora `0.2E+01` avalie a `2`. (Bug #15890)

* `partition_definition`

Cada partição pode ser definida individualmente usando uma cláusula *`partition_definition`*. As partes individuais que compõem essa cláusula são as seguintes:

+ `PARTITION partition_name`

Especifica um nome lógico para a partição.

+ `VALUES`

Para a partição por faixa, cada partição deve incluir uma cláusula `VALUES LESS THAN`; para a partição por lista, você deve especificar uma cláusula `VALUES IN` para cada partição. Isso é usado para determinar quais strings devem ser armazenadas nesta partição. Consulte as discussões sobre os tipos de partição no Capítulo 22, *Partição*, para exemplos de sintaxe.

+ `[STORAGE] ENGINE`

O manipulador de partição aceita uma opção `[STORAGE] ENGINE` tanto para `PARTITION` quanto para `SUBPARTITION`. Atualmente, a única maneira de usá-la é definir todas as partições ou todas as subpartições no mesmo mecanismo de armazenamento, e uma tentativa de definir diferentes mecanismos de armazenamento para partições ou subpartições na mesma tabela gera o erro ERROR 1469 (HY000): A mistura de manipuladores nas partições não é permitida nesta versão do MySQL. Esperamos eliminar essa restrição sobre a partição em uma versão futura do MySQL.

+ `COMMENT`

Uma cláusula opcional `COMMENT` pode ser usada para especificar uma string que descreva a partição. Exemplo:

    ```sql
    COMMENT = 'Data for the years previous to 1999'
    ```

O comprimento máximo para um comentário de partição é de 1024 caracteres.

+ `DATA DIRECTORY` e `INDEX DIRECTORY`

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

`DATA DIRECTORY` e `INDEX DIRECTORY` se comportam da mesma maneira que na cláusula *`table_option`* da declaração `CREATE TABLE` como utilizado para as tabelas `MyISAM`.

Um diretório de dados e um diretório de índice podem ser especificados por partição. Se não forem especificados, os dados e índices são armazenados, por padrão, no diretório do banco de dados da tabela.

Em Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para partições ou subpartições individuais das tabelas `MyISAM`, e a opção `INDEX DIRECTORY` não é suportada para partições ou subpartições individuais das tabelas `InnoDB`. Essas opções são ignoradas em Windows, exceto que um aviso é gerado. (Bug #30459)

Nota

As opções `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas ao criar tabelas particionadas se `NO_DIR_IN_CREATE` estiver em vigor. (Bug #24633)

+ `MAX_ROWS` e `MIN_ROWS`

Pode ser usado para especificar, respectivamente, o número máximo e mínimo de strings a serem armazenadas na partição. Os valores para *`max_number_of_rows`* e *`min_number_of_rows`* devem ser números inteiros positivos. Assim como as opções de nível de tabela com os mesmos nomes, essas atuam apenas como “sugestões” para o servidor e não são limites rígidos.

+ `TABLESPACE`

Pode ser usado para designar um espaço de tabela para a partição. É suportado pelo NDB Cluster. Para as tabelas `InnoDB`, pode ser usado para designar um espaço de tabela por arquivo para a partição, especificando `` TABLESPACE `innodb_file_per_table` ``. Todas as partições devem pertencer ao mesmo mecanismo de armazenamento.

Nota

O suporte para a colocação de partições de tabela `InnoDB` em espaços de tabela `InnoDB` compartilhados é descontinuado no MySQL 5.7.24; espera-se que ele seja removido em uma versão futura do MySQL. Os espaços de tabela compartilhados incluem o espaço de tabela do sistema `InnoDB` e espaços de tabela gerais.

* `subpartition_definition`

A definição de partição pode opcionalmente conter uma ou mais cláusulas *`subpartition_definition`*. Cada uma dessas consiste, no mínimo, no `SUBPARTITION name`, onde *`name`* é um identificador para a subpartição. Exceto pela substituição da palavra-chave `PARTITION` pelo `SUBPARTITION`, a sintaxe para uma definição de subpartição é idêntica à de uma definição de partição.

A subpartição deve ser feita por `HASH` ou `KEY`, e só pode ser feita em partições de `RANGE` ou `LIST`. Veja a Seção 22.2.6, “Subpartição”.

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

A partição vê uma coluna gerada como uma coluna regular, o que permite contornar as limitações em funções que não são permitidas para partição (consulte a Seção 22.6.3, “Limitações de Partição Relativas a Funções”). O exemplo anterior demonstra essa técnica: `EXP()` não pode ser usado diretamente na cláusula `PARTITION BY`, mas uma coluna gerada definida usando `EXP()` é permitida.

#### 13.1.18.1 Arquivos criados por CREATE TABLE

MySQL representa cada tabela por um arquivo de formato de tabela `.frm` (definição) no diretório do banco de dados. O mecanismo de armazenamento da tabela também pode criar outros arquivos.

Para uma tabela `InnoDB` criada em um espaço de tabelas por arquivo ou espaço de tabelas geral, os dados da tabela e os índices associados são armazenados em um arquivo .ibd no diretório do banco de dados. Quando uma tabela `InnoDB` é criada no espaço de tabelas do sistema, os dados da tabela e os índices são armazenados nos arquivos ibdata\* que representam o espaço de tabelas do sistema. A opção `innodb_file_per_table` controla se as tabelas são criadas em espaços de tabelas por arquivo ou no espaço de tabelas do sistema, por padrão. A opção `TABLESPACE` pode ser usada para colocar uma tabela em um espaço de tabelas por arquivo, espaço de tabelas geral ou no espaço de tabelas do sistema, independentemente da configuração `innodb_file_per_table`.

Para as tabelas `MyISAM`, o mecanismo de armazenamento cria arquivos de dados e índices. Assim, para cada tabela `MyISAM` *`tbl_name`*, há três arquivos de disco.

<table summary="The purpose of MyISAM table tbl_name disk files."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><code>tbl_name</code>.frm</code></td> <td>Table format (definition) file</td> </tr><tr> <td><code><code>tbl_name</code>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><code>tbl_name</code>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

O Capítulo 15, *Motores de Armazenamento Alternativos*, descreve quais arquivos cada motor de armazenamento cria para representar tabelas. Se o nome de uma tabela contiver caracteres especiais, os nomes dos arquivos da tabela contêm versões codificadas desses caracteres, conforme descrito na Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivo”.

Limites impostos pela estrutura do arquivo .frm

Como descrito anteriormente, cada tabela tem um arquivo `.frm` que contém a definição da tabela. O servidor usa a seguinte expressão para verificar algumas das informações da tabela armazenadas no arquivo contra um limite superior de 64 KB:

```sql
if (info_length+(ulong) create_fields.elements*FCOMP+288+
    n_length+int_length+com_length > 65535L || int_count > 255)
```

A porção da informação armazenada no arquivo `.frm` que é verificada contra a expressão não pode crescer além do limite de 64 KB, portanto, se a definição da tabela atingir esse tamanho, mais colunas não podem ser adicionadas.

Os fatores relevantes na expressão são:

* `info_length` é espaço necessário para "ecrans". Isso está relacionado à herança Unireg do MySQL.

* `create_fields.elements` é o número de colunas.

* `FCOMP` é 17. * `n_length` é o comprimento total de todos os nomes de coluna, incluindo um byte por nome como separador.

* `int_length` está relacionado à lista de valores das colunas `ENUM` e `SET`. Nesse contexto, “int” não significa “inteiro”. Significa “intervalo”, um termo que se refere coletivamente às colunas `ENUM` e `SET`.

* `int_count` é o número de definições únicas de `ENUM` e `SET`.

* `com_length` é o comprimento total dos comentários da coluna.

A expressão descrita acima tem várias implicações para as definições de tabela permitidas:

* O uso de nomes de colunas longos pode reduzir o número máximo de colunas, assim como a inclusão das colunas `ENUM` ou `SET`, ou o uso de comentários de coluna.

* Uma tabela não pode ter mais de 255 definições únicas de `ENUM` e `SET`. Colunas com listas de elementos idênticas são consideradas iguais para este limite. Por exemplo, se uma tabela contém essas duas colunas, elas contam como uma (e não duas) para este limite, porque as definições são idênticas:

  ```sql
  e1 ENUM('a','b','c')
  e2 ENUM('a','b','c')
  ```

* A soma da extensão dos nomes dos elementos nas definições únicas `ENUM` e `SET` conta para o limite de 64 KB, portanto, embora o limite teórico sobre o número de elementos em uma coluna específica `ENUM` seja de 65.535, o limite prático é inferior a 3000.

#### 13.1.18.2 Declaração de criação de tabela temporária

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é descartada automaticamente quando a sessão é fechada. Isso significa que duas sessões diferentes podem usar o mesmo nome de tabela temporária sem conflitar entre si ou com uma tabela não `TEMPORARY` existente do mesmo nome. (A tabela existente é oculta até que a tabela temporária seja descartada.)

`CREATE TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

As tabelas `TEMPORARY` têm uma relação muito laxa com bancos de dados (esquemas). A eliminação de um banco de dados não elimina automaticamente quaisquer tabelas `TEMPORARY` criadas dentro desse banco de dados. Além disso, é possível criar uma tabela `TEMPORARY` em um banco de dados inexistente se você qualificar o nome da tabela com o nome do banco de dados na declaração `CREATE TABLE`. Neste caso, todas as referências subsequentes à tabela devem ser qualificadas com o nome do banco de dados.

Para criar uma tabela temporária, você deve ter o privilégio `CREATE TEMPORARY TABLES`. Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão que está criando pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`.

Uma implicação desse comportamento é que uma sessão pode manipular suas tabelas temporárias mesmo que o usuário atual não tenha privilégio para criá-las. Suponha que o usuário atual não tenha o privilégio `CREATE TEMPORARY TABLES`, mas seja capaz de executar um procedimento armazenado de contexto definidor que é executado com os privilégios de um usuário que tem `CREATE TEMPORARY TABLES` e que cria uma tabela temporária. Enquanto o procedimento é executado, a sessão usa os privilégios do usuário definidor. Após o procedimento retornar, os privilégios efetivos retornam para os do usuário atual, que ainda pode ver a tabela temporária e realizar qualquer operação nela.

Nota

O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com `CREATE TEMPORARY TABLE` é descontinuado a partir do MySQL 5.7.24; espere que ele seja removido em uma versão futura do MySQL.

#### 13.1.18.3 Declaração CREATE TABLE ... LIKE

Use `CREATE TABLE ... LIKE` para criar uma tabela vazia com base na definição de outra tabela, incluindo quaisquer atributos de coluna e índices definidos na tabela original:

```sql
CREATE TABLE new_tbl LIKE orig_tbl;
```

A cópia é criada usando a mesma versão do formato de armazenamento de tabela do mesmo que a tabela original. O privilégio `SELECT` é necessário na tabela original.

`LIKE` funciona apenas para tabelas básicas, não para visualizações.

Importante

Você não pode executar `CREATE TABLE` ou `CREATE TABLE ... LIKE` enquanto uma declaração `LOCK TABLES` estiver em vigor.

`CREATE TABLE ... LIKE` faz os mesmos verificações que `CREATE TABLE` e não apenas copia o arquivo `.frm`. Isso significa que, se o modo SQL atual for diferente do modo em vigor quando a tabela original foi criada, a definição da tabela pode ser considerada inválida para o novo modo, e a declaração falha.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações da coluna gerada da tabela original.

`CREATE TABLE ... LIKE` não preserva nenhuma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` que foram especificadas para a tabela original, ou qualquer definição de chave estrangeira.

Se a tabela original for uma tabela `TEMPORARY`, a tabela `CREATE TABLE ... LIKE` não preserva `TEMPORARY`. Para criar uma tabela de destino `TEMPORARY`, use `CREATE TEMPORARY TABLE ... LIKE`.

#### 13.1.18.4 Criar uma declaração `CREATE TABLE ... SELECT`

Você pode criar uma tabela a partir de outra adicionando uma declaração `SELECT` no final da declaração `CREATE TABLE`:

```sql
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos no `SELECT`. Por exemplo:

```sql
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da declaração `CREATE TABLE`, e não deve ser usada após o `SELECT`; isso resultaria em um erro de sintaxe. O mesmo vale para outras opções `CREATE TABLE`, como `CHARSET`.

Observe que as colunas da declaração `SELECT` são anexadas ao lado direito da tabela, e não sobrepostas sobre ela. Tome o seguinte exemplo:

```sql
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

Para cada string da tabela `foo`, uma string é inserida na tabela `bar` com os valores da tabela `foo` e valores padrão para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`, as colunas nomeadas apenas na parte de `CREATE TABLE` vêm primeiro. As colunas nomeadas tanto na parte de quanto na parte de `SELECT` vêm depois. O tipo de dados das colunas de `SELECT` pode ser sobrescrito especificando também a coluna na parte de `CREATE TABLE`.

Se ocorrerem erros durante a cópia dos dados para a tabela, eles serão automaticamente descartados e não criados.

Você pode preceder o `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com strings que duplicam valores de chave única. Com `IGNORE`, as strings que duplicam uma string existente em um valor de chave única são descartadas. Com `REPLACE`, as novas strings substituem as strings que têm o mesmo valor de chave única. Se nem `IGNORE` nem `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

Como a ordem das strings nas declarações subjacentes `SELECT` nem sempre pode ser determinada, as declarações `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são marcadas como inseguras para replicação baseada em declarações. Essas declarações produzem um aviso no log de erro ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em string ao usar o modo `MIXED`. Veja também a Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em String”.

`CREATE TABLE ... SELECT` não cria automaticamente nenhum índice para você. Isso é feito intencionalmente para tornar a declaração o mais flexível possível. Se você deseja ter índices na tabela criada, deve especificar esses índices antes da declaração `SELECT`:

```sql
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada foram geradas. A parte `SELECT` da declaração não pode atribuir valores às colunas geradas na tabela de destino.

Pode ocorrer alguma conversão de tipos de dados. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado, e as colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos retreinados são `NULL` (ou `NOT NULL`) e, para as colunas que os possuem, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`, certifique-se de aliar quaisquer chamadas de função ou expressões na consulta. Se você não fizer isso, a declaração `CREATE` pode falhar ou resultar em nomes de colunas indesejados.

```sql
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

Você também pode especificar explicitamente o tipo de dados para uma coluna na tabela criada:

```sql
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

Para `CREATE TABLE ... SELECT`, se `IF NOT EXISTS` for fornecido e a tabela de destino existir, nada é inserido na tabela de destino e a declaração não é registrada.

Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes durante o `CREATE TABLE ... SELECT`.

Você não pode usar `FOR UPDATE` como parte do `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. Se você tentar fazer isso, a declaração falha.

#### 13.1.18.5 Restrições de Chave Estrangeira

O MySQL suporta chaves estrangeiras, que permitem a correlação de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais da coluna e uma tabela filho com valores de coluna que fazem referência aos valores da coluna pai. Uma restrição de chave estrangeira é definida na tabela filho.

A sintaxe essencial para definir uma restrição de chave estrangeira em uma declaração `CREATE TABLE` ou `ALTER TABLE` inclui o seguinte:

```sql
[CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

O uso de restrição de chave estrangeira é descrito nos seguintes tópicos desta seção:

* Identificadores
* Condições e restrições
* Ações referenciadas
* Exemplos de restrição de chave estrangeira
* Adicionando restrições de chave estrangeira
* Arrastando restrições de chave estrangeira
* Verificações de chave estrangeira
* Definições e metadados da chave estrangeira
* Erros de chave estrangeira

##### Identificadores

A nomenclatura das restrições de chave estrangeira é regida pelas seguintes regras:

O valor `CONSTRAINT` *`symbol`* é utilizado, se definido.

* Se a cláusula `CONSTRAINT` *`symbol`* não for definida, ou se um símbolo não for incluído após a palavra-chave `CONSTRAINT`:

+ Para as tabelas `InnoDB`, um nome de restrição é gerado automaticamente.

Para as tabelas `NDB`, o valor [[`FOREIGN KEY`]*`index_name` é usado, se definido. Caso contrário, um nome de restrição é gerado automaticamente.

* O valor `CONSTRAINT symbol`, se definido, deve ser único no banco de dados. Um duplicado *`symbol`* resulta em um erro semelhante ao seguinte: ERRO 1005 (HY000): Não é possível criar a tabela 'test.fk1' (erro de número 121).

Os identificadores de tabela e coluna em uma cláusula `FOREIGN KEY ... REFERENCES` podem ser citados dentro de backticks (`` ` ``). Alternatively, double quotation marks (`"`) can be used if the `A configuração da variável do sistema ANSI_QUOTES` SQL mode is enabled. The ` também é levada em conta.

##### Condições e Restrições

As restrições de chave estrangeira estão sujeitas às seguintes condições e restrições:

As tabelas de pais e filhos devem usar o mesmo mecanismo de armazenamento e não podem ser definidas como tabelas temporárias.

* Para criar uma restrição de chave estrangeira, é necessário o privilégio `REFERENCES` na tabela principal.

* As colunas correspondentes na chave estrangeira e na chave referenciada devem ter tipos de dados semelhantes. * O tamanho e o sinal dos tipos de precisão fixa, como `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DECIMAL` - DECIMAL, NUMERIC") devem ser os mesmos. O comprimento dos tipos de string não precisa ser o mesmo. Para colunas de string não binárias (caracteres), o conjunto de caracteres e a correção devem ser os mesmos.

* O MySQL suporta referências de chave estrangeira entre uma coluna e outra dentro de uma tabela. (Uma coluna não pode ter uma referência de chave estrangeira para si mesma.) Nesses casos, um "registro de tabela de filho" refere-se a um registro dependente na mesma tabela.

* O MySQL requer índices em chaves estrangeiras e chaves referenciadas para que as verificações de chave estrangeira possam ser rápidas e não exijam uma varredura da tabela. Na tabela de referência, deve haver um índice onde as colunas da chave estrangeira estão listadas como as *primeiras* colunas na mesma ordem. Esse índice é criado na tabela de referência automaticamente se não existir. Esse índice pode ser silenciosamente descartado mais tarde se você criar outro índice que possa ser usado para impor a restrição da chave estrangeira. *`index_name`*, se fornecido, é usado conforme descrito anteriormente.

* `InnoDB` permite que uma chave estrangeira faça referência a qualquer coluna de índice ou grupo de colunas. No entanto, na tabela referenciada, deve haver um índice onde as colunas referenciadas sejam as *primeiras* colunas na mesma ordem. Colunas ocultas que `InnoDB` adiciona a um índice também são consideradas (consulte Seção 14.6.2.1, “Indekses agrupados e secundários”).

`NDB` exige uma chave única explícita (ou chave primária) em qualquer coluna referenciada como chave estrangeira. `InnoDB` não exige, o que é uma extensão do SQL padrão.

* Prefixo de índice em colunas de chave estrangeira não são suportados. Consequentemente, as colunas `BLOB` e `TEXT` não podem ser incluídas em uma chave estrangeira porque os índices nessas colunas devem sempre incluir um comprimento de prefixo.

* `InnoDB` atualmente não suporta chaves estrangeiras para tabelas com particionamento definido pelo usuário. Isso inclui tanto as tabelas pai quanto as tabelas filho.

Essa restrição não se aplica às tabelas `NDB` que são particionadas por `KEY` ou `LINEAR KEY` (os únicos tipos de particionamento de usuário suportados pelo motor de armazenamento `NDB`); essas podem ter referências de chave estrangeira ou serem os alvos de tais referências.

* Uma tabela em uma relação de chave estrangeira não pode ser alterada para usar outro mecanismo de armazenamento. Para alterar o mecanismo de armazenamento, você deve primeiro descartar quaisquer restrições de chave estrangeira.

* Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

* Antes de 5.7.16, uma restrição de chave estrangeira não pode referenciar um índice secundário definido em uma coluna gerada virtualmente.

Para informações sobre como a implementação do MySQL de restrições de chave estrangeira difere do padrão SQL, consulte a Seção 1.6.2.3, “Diferenças da Restrição de Chave Estrangeira”.

##### Ações Referenciais

Quando uma operação `UPDATE` ou `DELETE` afeta um valor chave na tabela principal que tem strings correspondentes na tabela secundária, o resultado depende da *ação referencial* especificada pelos subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. As ações referenciais incluem:

* `CASCADE`: Exclua ou atualize a string da tabela principal e exclua ou atualize automaticamente as strings correspondentes na tabela secundária. Ambos `ON DELETE CASCADE` e `ON UPDATE CASCADE` são suportados. Entre duas tabelas, não defina várias cláusulas `ON UPDATE CASCADE` que atuem na mesma coluna na tabela principal ou na tabela secundária.

Se uma cláusula `FOREIGN KEY` for definida em ambas as tabelas em uma relação de chave estrangeira, tornando ambas as tabelas pais e filhos, uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` definida para uma cláusula `FOREIGN KEY` deve ser definida para a outra para que as operações em cascata sejam bem-sucedidas. Se uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` for definida apenas para uma cláusula `FOREIGN KEY`, as operações em cascata falham com um erro.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

* `SET NULL`: Exclua ou atualize a string da tabela principal e defina a coluna ou colunas da chave estrangeira na tabela secundária para `NULL`. As cláusulas `ON DELETE SET NULL` e `ON UPDATE SET NULL` são suportadas.

Se você especificar uma ação `SET NULL`, *assegure-se de que não tenha declarado as colunas na tabela secundária como [[`NOT NULL`]*.

* `RESTRICT`: Rejeita a operação de exclusão ou atualização para a tabela principal. Especificar `RESTRICT` (ou `NO ACTION`) é o mesmo que omitir a cláusula `ON DELETE` ou `ON UPDATE`.

* `NO ACTION`: Uma palavra-chave do SQL padrão. Para `InnoDB`, isso é equivalente a `RESTRICT`; a operação de exclusão ou atualização para a tabela pai é imediatamente rejeitada se houver um valor de chave estrangeira relacionado na tabela referenciada. `NDB` suporta verificações diferidas, e `NO ACTION` especifica uma verificação diferida; quando isso é usado, os verificações de restrição não são realizadas até o momento do commit. Note que, para tabelas de `NDB`, isso faz com que todas as verificações de chave estrangeira feitas tanto para a tabela pai quanto para a tabela filho sejam diferidas.

* `SET DEFAULT`: Esta ação é reconhecida pelo analisador MySQL, mas tanto `InnoDB` quanto `NDB` rejeitam definições de tabela que contêm cláusulas `ON DELETE SET DEFAULT` ou `ON UPDATE SET DEFAULT`.

Para motores de armazenamento que suportam chaves estrangeiras, o MySQL rejeita qualquer operação `INSERT` ou `UPDATE` que tente criar um valor de chave estrangeira em uma tabela secundária se não houver um valor de chave candidata correspondente na tabela principal.

Para um `ON DELETE` ou `ON UPDATE` que não é especificado, a ação padrão é sempre `RESTRICT`.

Para as tabelas `NDB`, `ON UPDATE CASCADE` não é suportada quando a referência é à chave primária da tabela pai.

A partir do NDB 7.5.14 e do NDB 7.6.10: Para as tabelas `NDB`, `ON DELETE CASCADE` não é suportada quando a tabela secundária contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

`InnoDB` realiza operações em cascata usando um algoritmo de pesquisa de primeira profundidade nos registros do índice que corresponde à restrição de chave estrangeira.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

Em MySQL 5.7.13 e versões anteriores, `InnoDB` não permite definir uma restrição de chave estrangeira com uma ação de referência em cascata na coluna base de uma coluna virtual gerada indexada. Essa restrição é eliminada no MySQL 5.7.14.

Em MySQL 5.7.13 e versões anteriores, `InnoDB` não permite definir ações de referência em cascata em colunas de chave estrangeira não virtual que estão explicitamente incluídas em um índice virtual. Essa restrição é eliminada no MySQL 5.7.14.

##### Exemplos de restrição de chave estrangeira

Este exemplo simples relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna:

```sql
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
```

Este é um exemplo mais complexo, em que uma tabela `product_order` possui chaves estrangeiras para outras duas tabelas. Uma chave estrangeira faz referência a um índice de duas colunas na tabela `product`. A outra faz referência a um índice de uma coluna na tabela `customer`:

```sql
CREATE TABLE product (
    category INT NOT NULL, id INT NOT NULL,
    price DECIMAL,
    PRIMARY KEY(category, id)
)   ENGINE=INNODB;

CREATE TABLE customer (
    id INT NOT NULL,
    PRIMARY KEY (id)
)   ENGINE=INNODB;

CREATE TABLE product_order (
    no INT NOT NULL AUTO_INCREMENT,
    product_category INT NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,

    PRIMARY KEY(no),
    INDEX (product_category, product_id),
    INDEX (customer_id),

    FOREIGN KEY (product_category, product_id)
      REFERENCES product(category, id)
      ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (customer_id)
      REFERENCES customer(id)
)   ENGINE=INNODB;
```

##### Adicionando restrições de chave estrangeira

Você pode adicionar uma restrição de chave estrangeira a uma tabela existente usando a seguinte sintaxe `ALTER TABLE`:

```sql
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

A chave estrangeira pode ser autoreferencial (referindo à mesma tabela). Quando você adiciona uma restrição de chave estrangeira a uma tabela usando `ALTER TABLE`, *não se esqueça de criar um índice primeiro nas colunas referenciadas pela chave estrangeira.*

##### Deixar as restrições de chave estrangeira em branco

Você pode descartar uma restrição de chave estrangeira usando a seguinte sintaxe `ALTER TABLE`:

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Se a cláusula `FOREIGN KEY` definiu um nome `CONSTRAINT` quando você criou a restrição, você pode se referir a esse nome para descartar a restrição de chave estrangeira. Caso contrário, um nome de restrição foi gerado internamente, e você deve usar esse valor. Para determinar o nome da restrição de chave estrangeira, use `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

A adição e a remoção de uma chave estrangeira na mesma declaração `ALTER TABLE` é suportada para `ALTER TABLE ... ALGORITHM=INPLACE`. Não é suportada para `ALTER TABLE ... ALGORITHM=COPY`.

##### Verificações de Chave Estrangeira

Nas tabelas MySQL, as tabelas InnoDB e NDB suportam a verificação de restrições de chave estrangeira. A verificação de chave estrangeira é controlada pela variável `foreign_key_checks`, que é habilitada por padrão. Normalmente, você deixa essa variável habilitada durante o funcionamento normal para impor a integridade referencial. A variável `foreign_key_checks` tem o mesmo efeito nas tabelas `NDB` que tem nas tabelas `InnoDB`.

A variável `foreign_key_checks` é dinâmica e suporta escopos globais e de sessão. Para informações sobre o uso de variáveis do sistema, consulte a Seção 5.1.8, “Usando Variáveis do Sistema”.

Desabilitar a verificação de chave estrangeira é útil quando:

* Deixar de lado uma tabela que é referenciada por uma restrição de chave estrangeira. Uma tabela referenciada só pode ser deixada de lado após `foreign_key_checks` ser desativado. Ao deixar de lado uma tabela, as restrições definidas na tabela também são deixadas de lado.

* Recarregar tabelas em uma ordem diferente daquela exigida por suas relações de chave estrangeira. Por exemplo, **mysqldump** produz definições corretas das tabelas no arquivo de dump, incluindo restrições de chave estrangeira para tabelas secundárias. Para facilitar o recarregamento de arquivos de dump para tabelas com relações de chave estrangeira, **mysqldump** inclui automaticamente uma declaração na saída do dump que desativa `foreign_key_checks`. Isso permite que você importe as tabelas em qualquer ordem, caso o arquivo de dump contenha tabelas que não estejam corretamente ordenadas para chaves estrangeiras. Desabilitar `foreign_key_checks` também acelera a operação de importação, evitando verificações de chave estrangeira.

* Executar operações `LOAD DATA`, para evitar verificação de chave estrangeira.

* Realizar uma operação `ALTER TABLE` em uma tabela que possui uma relação de chave estrangeira.

Quando o `foreign_key_checks` é desativado, as restrições de chave estrangeira são ignoradas, com as seguintes exceções:

* Recriar uma tabela que foi previamente excluída retorna um erro se a definição da tabela não atender às restrições de chave estrangeira que fazem referência à tabela. A tabela deve ter os nomes e tipos de coluna corretos. Deve também ter índices nas chaves referenciadas. Se esses requisitos não forem atendidos, o MySQL retorna o erro 1005 que se refere ao erro: 150 na mensagem de erro, o que significa que uma restrição de chave estrangeira não foi formada corretamente.

* Altering uma tabela retorna um erro (errno: 150) se uma definição de chave estrangeira estiver incorretamente formada para a tabela alterada.

* A remoção de um índice exigido por uma restrição de chave estrangeira. A restrição de chave estrangeira deve ser removida antes da remoção do índice.

* Criar uma restrição de chave estrangeira onde uma coluna faz referência a um tipo de coluna que não corresponde.

Desabilitar `foreign_key_checks` tem essas implicações adicionais:

* É permitido descartar um banco de dados que contém tabelas com chaves estrangeiras que são referenciadas por tabelas fora do banco de dados.

* É permitido descartar uma tabela com chaves estrangeiras referenciadas por outras tabelas.

* A habilitação de `foreign_key_checks` não desencadeia uma varredura dos dados da tabela, o que significa que as strings adicionadas a uma tabela enquanto `foreign_key_checks` está desativado não são verificadas quanto à consistência quando `foreign_key_checks` é reativado.

##### Definições de Chave Estrangeira e Metadados

Para visualizar uma definição de chave estrangeira, use `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

Você pode obter informações sobre chaves estrangeiras da tabela do esquema de informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

Você pode obter informações específicas para as chaves estrangeiras `InnoDB` das tabelas `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`. Exemplos de consultas são mostrados aqui:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Erros de Chave Estrangeira

Em caso de erro de chave estrangeira envolvendo as tabelas `InnoDB` (geralmente o Erro 150 no MySQL Server), as informações sobre o último erro de chave estrangeira podem ser obtidas verificando a saída `SHOW ENGINE INNODB STATUS`.

```sql
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2014-10-16 18:35:18 0x7fc2a95c1700 Transaction:
TRANSACTION 1814, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 2, OS thread handle 140474041767680, query id 74 localhost
root update
INSERT INTO child VALUES
    (NULL, 1)
    , (NULL, 2)
    , (NULL, 3)
    , (NULL, 4)
    , (NULL, 5)
    , (NULL, 6)
Foreign key constraint fails for table `mysql`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent`
  (`id`) ON DELETE CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `mysql`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 00000000070a; asc       ;;
 2: len 7; hex aa0000011d0134; asc       4;;
...
```

Aviso

Mensagens de erro `ER_NO_REFERENCED_ROW_2` e `ER_ROW_IS_REFERENCED_2` para operações de chave estrangeira exibem informações sobre as tabelas pai, mesmo que o usuário não tenha privilégios de acesso à tabela pai. Para ocultar informações sobre as tabelas pai, inclua os manipuladores de condição apropriados no código do aplicativo e nos programas armazenados.

#### 13.1.18.6 Alterações nas especificações da coluna silenciosa

Em alguns casos, o MySQL muda silenciosamente as especificações de coluna das fornecidas em uma declaração `CREATE TABLE` ou `ALTER TABLE`. Essas mudanças podem ser de um tipo de dado, de atributos associados a um tipo de dado ou de uma especificação de índice.

Todas as alterações estão sujeitas ao limite interno de tamanho de string de 65.535 bytes, o que pode fazer com que algumas tentativas de alteração do tipo de dados falhem. Consulte a Seção 8.4.7, “Limites de contagem de colunas de tabela e tamanho de string”.

* Colunas que fazem parte de um `PRIMARY KEY` são feitas `NOT NULL` mesmo que não sejam declaradas dessa forma.

* Espaços em branco são automaticamente excluídos dos valores dos membros `ENUM` e `SET` quando a tabela é criada.

* O MySQL mapeia certos tipos de dados usados por outros fornecedores de bancos de dados SQL para tipos MySQL. Veja a Seção 11.9, “Usando tipos de dados de outros motores de banco de dados”.

* Se você incluir uma cláusula `USING` para especificar um tipo de índice que não é permitido para um determinado motor de armazenamento, mas há outro tipo de índice disponível que o motor pode usar sem afetar os resultados da consulta, o motor usa o tipo disponível.

* Se o modo SQL rigoroso não estiver habilitado, uma coluna `VARCHAR` com uma especificação de comprimento maior que 65535 é convertida para `TEXT`, e uma coluna `VARBINARY` com uma especificação de comprimento maior que 65535 é convertida para `BLOB`. Caso contrário, ocorre um erro em qualquer um desses casos.

* Especificar o atributo `CHARACTER SET binary` para um tipo de dados de caracteres faz com que a coluna seja criada como o tipo de dados binário correspondente: `CHAR` se torna `BINARY`, `VARCHAR` se torna `VARBINARY`, e `TEXT` se torna `BLOB`. Para os tipos de dados `ENUM` e `SET`, isso não ocorre; eles são criados conforme declarados. Suponha que você especifique uma tabela usando esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

A tabela resultante tem esta definição:

  ```sql
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

Para verificar se o MySQL usou um tipo de dado diferente do especificado, execute uma declaração `DESCRIBE` ou `SHOW CREATE TABLE` após criar ou alterar a tabela.

Certos outros tipos de alterações de dados podem ocorrer se você comprimir uma tabela usando **myisampack**. Veja a Seção 15.2.3.3, “Características da tabela comprimida”.

#### 13.1.18.7 CRIAR TABELA e Colunas Geradas

`CREATE TABLE` suporta a especificação de colunas geradas. Os valores de uma coluna gerada são calculados a partir de uma expressão incluída na definição da coluna.

As colunas geradas são suportadas pelo mecanismo de armazenamento `NDB` a partir do MySQL NDB Cluster 7.5.3.

O exemplo simples a seguir mostra uma tabela que armazena as medidas dos lados dos triângulos retângulos nas colunas `sidea` e `sideb`, e calcula o comprimento da hipotenusa em `sidec` (a raiz quadrada das somas dos quadrados dos outros lados):

```sql
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

Selecionando da tabela, obtém-se este resultado:

```sql
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Qualquer aplicativo que utilize a tabela `triangle` tem acesso aos valores da hipotenusa sem precisar especificar a expressão que os calcula.

As definições de coluna geradas têm essa sintaxe:

```sql
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY]] [[PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indica que a coluna é gerada e define a expressão usada para calcular os valores da coluna. `AS` pode ser precedido por `GENERATED ALWAYS` para tornar a natureza gerada da coluna mais explícita. Os construtos permitidos ou proibidos na expressão são discutidos mais adiante.

A palavra-chave `VIRTUAL` ou `STORED` indica como os valores das colunas são armazenados, o que tem implicações para o uso da coluna:

* `VIRTUAL`: Os valores das colunas não são armazenados, mas são avaliados quando as strings são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna virtual não ocupa armazenamento.

`InnoDB` suporta índices secundários em colunas virtuais. Veja a Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

* `STORED`: Os valores das colunas são avaliados e armazenados quando as strings são inseridas ou atualizadas. Uma coluna armazenada requer espaço de armazenamento e pode ser indexada.

O padrão é `VIRTUAL` se nenhum dos termos-chave for especificado.

É permitido misturar as colunas `VIRTUAL` e `STORED` dentro de uma tabela.

Outros atributos podem ser fornecidos para indicar se a coluna está indexada ou pode ser `NULL`, ou fornecer um comentário.

As expressões de coluna geradas devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Literais, funções internas determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocações produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Funções armazenadas e funções carregáveis não são permitidas. * Procedimentos armazenados e parâmetros de função não são permitidos. * Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programa armazenadas) não são permitidas.

* Subconsultas não são permitidas. * Uma definição de coluna gerada pode se referir a outras colunas geradas, mas apenas aquelas que ocorrem anteriormente na definição da tabela. Uma definição de coluna gerada pode se referir a qualquer coluna base (não gerada) na tabela, independentemente de sua definição ocorrer anteriormente ou posteriormente.

* O atributo `AUTO_INCREMENT` não pode ser usado em uma definição de coluna gerada.

* Uma coluna `AUTO_INCREMENT` não pode ser usada como uma coluna base em uma definição de coluna gerada.

* a partir do MySQL 5.7.10, se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a declaração `CREATE TABLE` termina com um erro e a operação DDL é rejeitada.

Se a expressão avaliar um tipo de dados que difere do tipo de coluna declarado, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 12.3, “Conversão de Tipo na Avaliação da Expressão”.

Nota

Se algum componente da expressão depender do modo SQL, podem ocorrer resultados diferentes para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações da coluna gerada da tabela original.

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada foram geradas. A parte `SELECT` da declaração não pode atribuir valores às colunas geradas na tabela de destino.

A partição por colunas geradas é permitida. Veja Partição de tabela.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para se referir a colunas geradas.

Para `INSERT`, `REPLACE` e `UPDATE`, se uma coluna gerada for inserida, substituída ou atualizada explicitamente, o único valor permitido é `DEFAULT`.

Uma coluna gerada em uma visualização é considerada atualizável, pois é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`.

As colunas geradas têm vários casos de uso, como estes:

* Colunas geradas virtualmente podem ser usadas como uma maneira de simplificar e unificar consultas. Uma condição complicada pode ser definida como uma coluna gerada e referenciada em várias consultas na tabela para garantir que todas elas usem exatamente a mesma condição.

* Colunas geradas armazenadas podem ser usadas como um cache materializado para condições complicadas que são custosas de calcular rapidamente.

* Colunas geradas podem simular índices funcionais: Use uma coluna gerada para definir uma expressão funcional e indexá-la. Isso pode ser útil para trabalhar com colunas de tipos que não podem ser indexados diretamente, como as colunas `JSON`; veja Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

Para colunas geradas armazenadas, a desvantagem dessa abordagem é que os valores são armazenados duas vezes: uma vez como o valor da coluna gerada e uma vez no índice.

* Se uma coluna gerada estiver indexada, o otimizador reconhece expressões de consulta que correspondem à definição da coluna e utiliza índices da coluna conforme apropriado durante a execução da consulta, mesmo que uma consulta não faça referência direta à coluna pelo nome. Para detalhes, consulte a Seção 8.3.10, “Uso do Otimizador de Índices de Coluna Gerada”.

Exemplo:

Suponha que uma tabela `t1` contenha as colunas `first_name` e `last_name` e que as aplicações frequentemente construam o nome completo usando uma expressão como esta:

```sql
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

Uma maneira de evitar a escrita da expressão é criar uma visão `v1` em `t1`, o que simplifica as aplicações, permitindo que elas selecionem diretamente `full_name` sem usar uma expressão:

```sql
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

Uma coluna gerada também permite que as aplicações selecionem `full_name` diretamente, sem a necessidade de definir uma visão:

```sql
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```

#### 13.1.18.8 Índices secundários e colunas geradas

`InnoDB` suporta índices secundários em colunas geradas virtualmente. Outros tipos de índice não são suportados. Um índice secundário definido em uma coluna virtual é às vezes referido como um "índice virtual".

Um índice secundário pode ser criado em uma ou mais colunas virtuais ou em uma combinação de colunas virtuais e colunas regulares ou colunas geradas armazenadas. Índices secundários que incluem colunas virtuais podem ser definidos como `UNIQUE`.

Quando um índice secundário é criado em uma coluna gerada virtualmente, os valores da coluna gerada são materializados nos registros do índice. Se o índice for um índice coberto (um que inclui todas as colunas recuperadas por uma consulta), os valores da coluna gerada são recuperados de valores materializados na estrutura do índice, em vez de serem calculados “on the fly”.

Há custos adicionais de escrita a serem considerados ao usar um índice secundário em uma coluna virtual devido à computação realizada ao materializar os valores da coluna virtual em registros de índice secundário durante as operações `INSERT` e `UPDATE`. Mesmo com custos adicionais de escrita, índices secundários em colunas virtuais podem ser preferíveis a colunas *armazenadas* geradas, que são materializadas no índice agrupado, resultando em tabelas maiores que requerem mais espaço em disco e memória. Se um índice secundário não for definido em uma coluna virtual, há custos adicionais para leituras, pois os valores da coluna virtual devem ser calculados cada vez que a string da coluna é examinada.

Os valores de uma coluna virtual indexada são registrados no MVCC para evitar a recomputação desnecessária dos valores da coluna gerada durante o rollback ou durante uma operação de purga. O comprimento dos dados dos valores registrados é limitado pelo limite da chave de índice de 767 bytes para os formatos de string `COMPACT` e `REDUNDANT` e 3072 bytes para os formatos de string `DYNAMIC` e `COMPRESSED`.

Adicionar ou excluir um índice secundário em uma coluna virtual é uma operação in-place.

Antes de 5.7.16, uma restrição de chave estrangeira não pode referenciar um índice secundário definido em uma coluna gerada virtualmente.

Em MySQL 5.7.13 e versões anteriores, `InnoDB` não permite definir uma restrição de chave estrangeira com uma ação de referência em cascata na coluna base de uma coluna virtual gerada indexada. Essa restrição é eliminada no MySQL 5.7.14.

##### Indicar uma coluna gerada para fornecer um índice de coluna JSON

Como mencionado em outro lugar, as colunas `JSON` não podem ser indexadas diretamente. Para criar um índice que faça referência a uma coluna dessa forma indiretamente, você pode definir uma coluna gerada que extraia as informações que devem ser indexadas, e então criar um índice na coluna gerada, como mostrado neste exemplo:

```sql
mysql> CREATE TABLE jemp (
    ->     c JSON,
    ->     g INT GENERATED ALWAYS AS (c->"$.id"),
    ->     INDEX i (g)
    -> );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO jemp (c) VALUES
     >   ('{"id": "1", "name": "Fred"}'), ('{"id": "2", "name": "Wilma"}'),
     >   ('{"id": "3", "name": "Barney"}'), ('{"id": "4", "name": "Betty"}');
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c->>"$.name" AS name
     >     FROM jemp WHERE g > 2;
+--------+
| name   |
+--------+
| Barney |
| Betty  |
+--------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT c->>"$.name" AS name
     >    FROM jemp WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name'))
AS `name` from `test`.`jemp` where (`test`.`jemp`.`g` > 2)
1 row in set (0.00 sec)
```

(Nós envolvemos a saída da última declaração neste exemplo para caber na área de visualização.)

O operador `->` é suportado no MySQL 5.7.9 e versões posteriores. O operador `->>` é suportado a partir do MySQL 5.7.13.

Quando você usa `EXPLAIN` em um `SELECT` ou outro comando SQL que contém uma ou mais expressões que utilizam o operador `->` ou `->>`, essas expressões são traduzidas em seus equivalentes usando `JSON_EXTRACT()` e (se necessário) `JSON_UNQUOTE()` em vez disso, como mostrado aqui na saída de `SHOW WARNINGS` imediatamente após esta declaração `EXPLAIN`:

```sql
mysql> EXPLAIN SELECT c->>"$.name"
     > FROM jemp WHERE g > 2 ORDER BY c->"$.name"\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where; Using filesort
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name')) AS
`c->>"$.name"` from `test`.`jemp` where (`test`.`jemp`.`g` > 2) order by
json_extract(`test`.`jemp`.`c`,'$.name')
1 row in set (0.00 sec)
```

Consulte as descrições dos operadores `->` e `->>`, bem como as dos `JSON_EXTRACT()` e `JSON_UNQUOTE()` funções, para obter informações adicionais e exemplos.

Essa técnica também pode ser usada para fornecer índices que fazem referência indireta a colunas de outros tipos que não podem ser indexadas diretamente, como as colunas `GEOMETRY`.

Colunas JSON e indexação indireta no NDB Cluster

É também possível usar indexação indireta de colunas JSON no MySQL NDB Cluster, sujeito às seguintes condições:

1. `NDB` lida internamente com o valor da coluna `JSON` como um `BLOB`. Isso significa que qualquer tabela `NDB` que tenha uma ou mais colunas JSON deve ter uma chave primária, caso contrário, não pode ser registrada no log binário.

2. O motor de armazenamento `NDB` não suporta indexação de colunas virtuais. Como o padrão para as colunas geradas é `VIRTUAL`, você deve especificar explicitamente a coluna gerada à qual se deseja aplicar o índice indireto como `STORED`.

A declaração **`CREATE TABLE`** usada para criar a tabela `jempn` mostrada aqui é uma versão da tabela `jemp` mostrada anteriormente, com modificações que a tornam compatível com `NDB`:

```sql
CREATE TABLE jempn (
  a BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.name") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

Podemos preencher esta tabela usando a seguinte declaração `INSERT`:

```sql
INSERT INTO jempn (a, c) VALUES
  (NULL, '{"id": "1", "name": "Fred"}'),
  (NULL, '{"id": "2", "name": "Wilma"}'),
  (NULL, '{"id": "3", "name": "Barney"}'),
  (NULL, '{"id": "4", "name": "Betty"}');
```

Agora o `NDB` pode usar o índice `i`, conforme mostrado aqui:

```sql
mysql> EXPLAIN SELECT c->>"$.name" AS name
          FROM jempn WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jempn
   partitions: p0,p1
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using where with pushed condition (`test`.`jempn`.`g` > 2)
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select
json_unquote(json_extract(`test`.`jempn`.`c`,'$.name')) AS `name` from
`test`.`jempn` where (`test`.`jempn`.`g` > 2)
1 row in set (0.00 sec)
```

Você deve ter em mente que uma coluna gerada armazenada, assim como qualquer índice em uma coluna desse tipo, usa `DataMemory`. No NDB 7.5, um índice em uma coluna gerada armazenada também usa `IndexMemory`.

#### 13.1.18.9 Configuração das opções de comentário NDB

* Opções NDB_COLUMN
* Opções NDB_TABLE

É possível definir uma série de opções específicas para o NDB Cluster na tabela de comentários ou comentários de coluna de uma tabela `NDB`. Opções de nível de tabela para controlar a leitura de qualquer replica e equilíbrio de partição podem ser incorporadas em um comentário de tabela usando `NDB_TABLE`.

`NDB_COLUMN` pode ser usado em um comentário de coluna para definir o tamanho da coluna da tabela de partes do blob usada para armazenar partes dos valores do blob por `NDB` até o seu máximo. Isso funciona para as colunas `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT` e `JSON`.

`NDB_TABLE` pode ser usado em um comentário de tabela para definir opções relacionadas ao equilíbrio da partição e se a tabela é totalmente replicada, entre outras coisas.

O restante desta seção descreve essas opções e seu uso.

##### NDB_COLUMN Opções

No NDB Cluster, um comentário de coluna em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_COLUMN`. O NDB 7.5 e 7.6 suportam uma opção de comentário de coluna única `MAX_BLOB_PART_SIZE`; a sintaxe para essa opção é mostrada aqui:

```sql
COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE[={0|1}]'
```

O sinal `=` e o valor que o segue são opcionais. O uso de qualquer valor diferente de 0 ou 1 resulta em um erro de sintaxe.

O efeito de usar `MAX_BLOB_PART_SIZE` em um comentário de coluna é definir o tamanho da parte do blob de uma coluna `TEXT` ou `BLOB` para o número máximo de bytes suportados para isso por `NDB` (13948). Esta opção pode ser aplicada a qualquer tipo de coluna de blob suportada pelo MySQL, exceto `TINYBLOB` ou `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). `MAX_BLOB_PART_SIZE` não tem efeito sobre as colunas `JSON`.

Você também deve ter em mente, especialmente ao trabalhar com as colunas `TEXT`, que o valor definido por `MAX_BLOB_PART_SIZE` representa o tamanho da coluna em bytes. Isso não indica o número de caracteres, que varia de acordo com o conjunto de caracteres e a ordenação utilizados pela coluna.

Para ver os efeitos desta opção, primeiro executamos a seguinte instrução SQL no cliente **mysql** para criar uma tabela com duas colunas `BLOB`, uma (`c1`) sem opções adicionais e outra (`c2`) com `MAX_BLOB_PART_SIZE`:

```sql
mysql> CREATE TABLE test.t (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

Do shell do sistema, execute o utilitário **ndb\_desc** para obter informações sobre a tabela recém criada, conforme mostrado neste exemplo:

```sql
$> ndb_desc -d test t
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

As informações das colunas na saída estão listadas em `Attributes`; para as colunas `c1` e `c2`, elas são exibidas aqui em texto destacado. Para `c1`, o tamanho da parte do blob é 2000, o valor padrão; para `c2`, é 13948, conforme definido por `MAX_BLOB_PART_SIZE`.

Você pode alterar o tamanho da parte do blob para uma coluna de blob específica de uma tabela `NDB` usando uma declaração `ALTER TABLE` como esta, e verificar as alterações posteriormente usando `SHOW CREATE TABLE`:

```sql
mysql> ALTER TABLE test.t
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

A saída do **ndb\_desc** mostra que os tamanhos das partes de blob das colunas foram alterados conforme esperado:

```sql
$> ndb_desc -d test t
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex

NDBT_ProgramExit: 0 - OK
```

A alteração do tamanho da parte blob de uma coluna deve ser feita usando uma cópia `ALTER TABLE`; essa operação não pode ser realizada online (consulte a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”).

Para mais informações sobre como o `NDB` armazena colunas de tipos blob, consulte os Requisitos de Armazenamento de Tipo de String.

##### Opções da Tabela NDB

Para uma tabela de NDB Cluster, o comentário da tabela em uma declaração `CREATE TABLE` ou `ALTER TABLE` também pode ser usado para especificar uma opção `NDB_TABLE`, que consiste em um ou mais pares nome-valor, separados por vírgulas, se necessário, seguindo a string `NDB_TABLE=`. A sintaxe completa para nomes e valores é mostrada aqui:

```sql
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,...]]"

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Espaços não são permitidos na string citada. A string é sensível a maiúsculas e minúsculas.

As quatro opções da tabela `NDB` que podem ser definidas como parte de um comentário dessa forma são descritas com mais detalhes nos próximos parágrafos.

`NOLOGGING`: Por padrão, as tabelas `NDB` são registradas e verificadas. Isso as torna resistentes a falhas em todo o clúster. Ao usar `NOLOGGING` ao criar ou alterar uma tabela, significa que essa tabela não é registrada novamente ou incluída em pontos de verificação locais. Neste caso, a tabela ainda é replicada nos nós de dados para alta disponibilidade e atualizada usando transações, mas as alterações nela feitas não são registradas nos logs de redo do nó de dados e seu conteúdo não é verificado em disco; ao recuperar de uma falha no clúster, o clúster retém a definição da tabela, mas nenhuma de suas strings — ou seja, a tabela está vazia.

O uso de tabelas sem registro dessas reduz as demandas do nó de dados em I/O de disco e armazenamento, bem como na CPU para o checkpointing da CPU. Isso pode ser adequado para dados de curta duração que são frequentemente atualizados e onde a perda de todos os dados no improvável caso de falha total do clúster é aceitável.

É também possível usar a variável de sistema `ndb_table_no_logging` para fazer com que quaisquer tabelas NDB criadas ou alteradas enquanto essa variável estiver em vigor se comportem como se tivessem sido criadas com o comentário `NOLOGGING`. Ao contrário do que acontece ao usar o comentário diretamente, não há nada nesse caso na saída de `SHOW CREATE TABLE` que indique que é uma tabela não registrada. Recomenda-se usar a abordagem de comentário de tabela, pois oferece controle por tabela da funcionalidade, e esse aspecto do esquema da tabela está embutido na declaração de criação da tabela, onde pode ser encontrado facilmente por ferramentas baseadas em SQL.

`READ_BACKUP`: Definir esta opção para 1 tem o mesmo efeito como se `ndb_read_backup` estivesse habilitado; habilita a leitura de qualquer réplica. Isso melhora significativamente o desempenho das leituras da tabela a um custo relativamente baixo para o desempenho de escrita.

A partir do MySQL NDB Cluster 7.5.3, você pode definir `READ_BACKUP` para uma tabela existente online (Bug #80858, Bug #23001617), usando uma declaração `ALTER TABLE` semelhante àquela mostrada aqui:

```sql
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

Antes do MySQL NDB Cluster 7.5.4, definir `READ_BACKUP` para 1 também fazia com que `FRAGMENT_COUNT_TYPE` fosse definido para `ONE_PER_LDM_PER_NODE_GROUP`.

Para mais informações sobre a opção `ALGORITHM` para `ALTER TABLE`, consulte a Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`PARTITION_BALANCE`: Oferece controle adicional sobre a atribuição e o posicionamento das partições. Os seguintes quatro esquemas são suportados:

1. `FOR_RP_BY_NODE`: Uma partição por nó.

Apenas um LDM em cada nó armazena uma partição primária. Cada partição é armazenada no mesmo LDM (mesma ID) em todos os nós.

2. `FOR_RA_BY_NODE`: Uma partição por grupo de nós.

Cada nó armazena uma única partição, que pode ser uma replica primária ou uma replica de backup. Cada partição é armazenada no mesmo LDM em todos os nós.

3. `FOR_RP_BY_LDM`: Uma partição para cada LDM em cada nó; o padrão.

Esse é o mesmo comportamento do que antes do MySQL NDB Cluster 7.5.2, exceto por uma mapeia ligeiramente diferente das partições para LDMs, começando com LDM 0 e colocando uma partição por grupo de nós, depois passando para o próximo LDM.

Em MySQL NDB Cluster 7.5.4 e versões posteriores, essa é a configuração usada se `READ_BACKUP` estiver definido como 1. (Bug #82634, Bug #24482114)

4. `FOR_RA_BY_LDM`: Uma partição por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

Antes do MySQL NDB Cluster 7.5.4, essa era a configuração usada se `READ_BACKUP` estivesse definido como 1.

5. `FOR_RA_BY_LDM_X_2`: Duas partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

Esse ajuste foi adicionado no NDB 7.5.4.

6. `FOR_RA_BY_LDM_X_3`: Três partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

Esse ajuste foi adicionado no NDB 7.5.4.

7. `FOR_RA_BY_LDM_X_4`: Quatro partições por LDM em cada grupo de nós.

Essas partições podem ser primárias ou de backup.

Esse ajuste foi adicionado no NDB 7.5.4.

Começando com o NDB 7.5.4, `PARTITION_BALANCE` é a interface preferida para definir o número de partições por tabela. Usar `MAX_ROWS` para forçar o número de partições é desaconselhado a partir do NDB 7.5.4, continua a ser suportado no NDB 7.6 para compatibilidade reversa, mas está sujeito à remoção em uma futura versão do MySQL NDB Cluster. (Bug #81759, Bug #23544301)

Antes do MySQL NDB Cluster 7.5.4, `PARTITION_BALANCE` era chamado de `FRAGMENT_COUNT_TYPE`, e aceito como seu valor um dos (na mesma ordem que a lista mostrada acima) `ONE_PER_NODE`, `ONE_PER_NODE_GROUP`, `ONE_PER_LDM_PER_NODE` ou `ONE_PER_LDM_PER_NODE_GROUP`. (Bug #81761, Bug #23547525)

`FULLY_REPLICATED` controla se a tabela é totalmente replicada, ou seja, se cada nó de dados tem uma cópia completa da tabela. Para habilitar a replicação total da tabela, use `FULLY_REPLICATED=1`.

Essa configuração também pode ser controlada usando a variável de sistema `ndb_fully_replicated`. Definindo-a como `ON`, a opção é ativada por padrão para todas as novas tabelas `NDB`; o padrão é `OFF`, que mantém o comportamento anterior (como no MySQL NDB Cluster 7.5.1 e versões anteriores, antes do suporte para tabelas totalmente replicadas). A variável de sistema `ndb_data_node_neighbour` também é usada para tabelas totalmente replicadas, para garantir que, quando uma tabela totalmente replicada é acessada, acesse o nó de dados que é local deste servidor MySQL.

Um exemplo de uma declaração `CREATE TABLE` que utiliza um comentário desse tipo ao criar uma tabela `NDB` é mostrado aqui:

```sql
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

O comentário é exibido como parte do resultado de `SHOW CREATE TABLE`. O texto do comentário também está disponível ao consultar o esquema de informações do MySQL `TABLES`, como neste exemplo:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

Essa sintaxe de comentário também é suportada com declarações `ALTER TABLE` para tabelas `NDB`, como mostrado aqui:

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Começando com o NDB 7.6.15, a coluna `TABLE_COMMENT` exibe o comentário que é necessário para recriar a tabela, pois está seguindo a declaração `ALTER TABLE`, assim:

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```sql
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Tenha em mente que um comentário de tabela usado com `ALTER TABLE` substitui qualquer comentário existente que a tabela possa ter.

```sql
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Antes da NDB 7.6.15, o comentário da tabela usado com `ALTER TABLE` substituiu qualquer comentário existente que a tabela pudesse ter tido. Isso significava que (por exemplo) o valor `READ_BACKUP` não era carregado para o novo comentário definido pela declaração `ALTER TABLE`, e que quaisquer valores não especificados retornavam aos seus valores padrão. (BUG#30428829) Assim, não havia mais nenhuma maneira de usar SQL para recuperar o valor previamente definido para o comentário. Para evitar que os valores do comentário retornem aos seus valores padrão, era necessário preservar quaisquer desses valores da string de comentário existente e incluí-los no comentário passado para `ALTER TABLE`.

Você também pode ver o valor da opção `PARTITION_BALANCE` na saída de **ndb\_desc**. **ndb\_desc** também mostra se as opções `READ_BACKUP` e `FULLY_REPLICATED` estão definidas para a tabela. Consulte a descrição deste programa para obter mais informações.

### 13.1.19 Declaração de CREATE TABLESPACE

```sql
CREATE TABLESPACE tablespace_name

  InnoDB and NDB:
    ADD DATAFILE 'file_name'

  InnoDB only:
    [FILE_BLOCK_SIZE = value]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [AUTOEXTEND_SIZE [=] autoextend_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]
```

Essa declaração é usada para criar um tablespace. A sintaxe e a semântica precisas dependem do mecanismo de armazenamento utilizado. Nas versões padrão do MySQL 5.7, esse é sempre um tablespace `InnoDB`. O MySQL NDB Cluster 7.5 também suporta tablespaces usando o mecanismo de armazenamento `NDB`, além dos que usam `InnoDB`.

* Considerações para InnoDB
* Considerações para NDB Cluster
* Opções
* Notas
* Exemplos de InnoDB
* Exemplo de NDB

#### Considerações para InnoDB

A sintaxe `CREATE TABLESPACE` é usada para criar espaços de tabelas gerais. Um espaço de tabelas geral é um espaço de tabelas compartilhado. Ele pode conter múltiplas tabelas e suporta todos os formatos de string de tabela. Espaços de tabelas gerais podem ser criados em um local relativo ou independente do diretório de dados.

Após criar um espaço de tabela geral `InnoDB`, você pode usar `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` para adicionar tabelas ao espaço de tabela. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

#### Considerações para o NDB Cluster

Essa declaração é usada para criar um tablespace, que pode conter um ou mais arquivos de dados, fornecendo espaço de armazenamento para tabelas de dados do NDB Cluster Disk (ver Seção 21.6.11, “Tabelas de Dados do NDB Cluster Disk”). Um arquivo de dados é criado e adicionado ao tablespace usando essa declaração. Arquivos de dados adicionais podem ser adicionados ao tablespace usando a declaração `ALTER TABLESPACE` (ver Seção 13.1.9, “Declaração ALTER TABLESPACE”).

Nota

Todos os objetos de dados de disco do NDB Cluster compartilham o mesmo espaço de nomes. Isso significa que *cada objeto de dados de disco* deve ser nomeado de forma única (e não apenas cada objeto de dados de disco de um tipo dado). Por exemplo, você não pode ter um espaço de tabelas e um grupo de arquivos de registro com o mesmo nome, ou um espaço de tabelas e um arquivo de dados com o mesmo nome.

Um grupo de arquivos de registro de um ou mais arquivos de registro `UNDO` deve ser atribuído ao tablespace que será criado com a cláusula `USE LOGFILE GROUP`. *`logfile_group`* deve ser um grupo de arquivos de registro existente criado com `CREATE LOGFILE GROUP` (consulte Seção 13.1.15, “Declaração CREATE LOGFILE GROUP”). Múltiplos tablespaces podem usar o mesmo grupo de arquivos de registro para o registro `UNDO`.

Ao definir `EXTENT_SIZE` ou `INITIAL_SIZE`, você pode, opcionalmente, seguir o número com uma abreviação de uma ordem de grandeza, semelhante àquelas usadas em `my.cnf`. Geralmente, essa é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

`INITIAL_SIZE` e `EXTENT_SIZE` estão sujeitos à arredondamento conforme a seguir:

* `EXTENT_SIZE` é arredondado para o múltiplo inteiro mais próximo de 32K.

* `INITIAL_SIZE` é arredondado *para baixo* para o múltiplo inteiro mais próximo de 32K; este resultado é arredondado para cima para o múltiplo inteiro mais próximo de `EXTENT_SIZE` (depois de qualquer arredondamento).

Nota

`NDB` reserva 4% de um espaço de tabela para operações de reinício do nó de dados. Esse espaço reservado não pode ser usado para armazenamento de dados. Essa restrição se aplica a partir do NDB 7.6.

O arredondamento descrito acima é feito explicitamente, e o MySQL Server emite um aviso quando qualquer arredondamento é realizado. Os valores arredondados também são usados pelo kernel NDB para calcular os valores das colunas do esquema de informações `FILES` e para outros propósitos. No entanto, para evitar um resultado inesperado, sugerimos que você sempre use múltiplos inteiros de 32K ao especificar essas opções.

Quando o `CREATE TABLESPACE` é usado com o `ENGINE [=] NDB`, um espaço de tabela e um arquivo de dados associado são criados em cada nó de dados do Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles, fazendo uma consulta à tabela do esquema de informações `FILES`. (Veja o exemplo mais adiante nesta seção.)

(Veja a Seção 24.3.9, “A Tabela INFORMATION\_SCHEMA FILES”).

#### Opções

* `ADD DATAFILE`: Define o nome de um arquivo de dados de espaço de tabela; esta opção é sempre necessária. O `file_name`, incluindo qualquer caminho especificado, deve ser citado com aspas simples ou duplas. Os nomes de arquivos (não contando a extensão do arquivo) e os nomes de diretórios devem ter pelo menos um byte de comprimento. Nomes de arquivos e nomes de diretórios de comprimento zero não são suportados.

Como há diferenças consideráveis na forma como os arquivos de dados são tratados pelos `InnoDB` e pelos `NDB`, os dois motores de armazenamento são abordados separadamente na discussão a seguir.

**Arquivos de dados do InnoDB.** Um espaço de tabela `InnoDB` suporta apenas um único arquivo de dados, cujo nome deve incluir uma extensão `.ibd`.

Para um espaço de tabela `InnoDB`, o arquivo de dados é criado por padrão no diretório de dados do MySQL (`datadir`). Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão.

Quando um espaço de tabela `InnoDB` é criado fora do diretório de dados, um arquivo isl é criado no diretório de dados. Para evitar conflitos com espaços de tabela por arquivo criados implicitamente, não é suportada a criação de um espaço de tabela geral `InnoDB` em um subdiretório sob o diretório de dados. Ao criar um espaço de tabela geral `InnoDB` fora do diretório de dados, o diretório deve existir antes de criar o espaço de tabela.

Nota

Em MySQL 5.7, `ALTER TABLESPACE` não é suportado por `InnoDB`.

**Arquivos de dados do NDB.** Um espaço de tabelas `NDB` suporta vários arquivos de dados que podem ter quaisquer nomes de arquivo legais; mais arquivos de dados podem ser adicionados a um espaço de tabelas do NDB Cluster após sua criação usando uma declaração `ALTER TABLESPACE`.

Um arquivo de dados de espaço de tabela `NDB` é criado por padrão no diretório do sistema de arquivos do nó de dados — ou seja, o diretório denominado `ndb_nodeid_fs/TS` sob o diretório de dados do nó de dados (`DataDir`), onde *`nodeid`* é o `NodeId` do nó de dados. Para colocar o arquivo de dados em um local diferente do padrão, inclua um caminho de diretório absoluto ou um caminho relativo à localização padrão. Se o diretório especificado não existir, `NDB` tenta criá-lo; a conta de usuário do sistema sob a qual o processo do nó de dados está em execução deve ter as permissões apropriadas para fazer isso.

Nota

Ao determinar o caminho usado para um arquivo de dados, `NDB` não expande o caractere `~` (tilde).

Quando vários nós de dados são executados no mesmo host físico, as seguintes considerações se aplicam:

+ Não é possível especificar um caminho absoluto ao criar um arquivo de dados.

+ Não é possível criar arquivos de dados do espaço de tabela fora do diretório do sistema de arquivos do nó de dados, a menos que cada nó de dados tenha um diretório de dados separado.

+ Se cada nó de dados tiver seu próprio diretório de dados, os arquivos de dados podem ser criados em qualquer lugar dentro desse diretório.

+ Se cada nó de dados tiver seu próprio diretório de dados, também é possível criar um arquivo de dados fora do diretório de dados do nó usando um caminho relativo, desde que esse caminho resolva a um local único no sistema de arquivos do host para cada nó de dados que está sendo executado nesse host.

* `FILE_BLOCK_SIZE`: Esta opção — que é específica para `InnoDB`, e é ignorada por `NDB` — define o tamanho do bloco para o arquivo de dados do espaço de tabela. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um tamanho de bloco de arquivo de 8 kilobytes pode ser especificado como 8192 ou 8K. Se você não especificar esta opção, `FILE_BLOCK_SIZE` tem como padrão o valor de `innodb_page_size`. `FILE_BLOCK_SIZE` é necessário quando você pretende usar o espaço de tabela para armazenar tabelas comprimidas `InnoDB` (`ROW_FORMAT=COMPRESSED`). Neste caso, você deve definir o espaço de tabela `FILE_BLOCK_SIZE` ao criar o espaço de tabela.

Se `FILE_BLOCK_SIZE` for igual ao valor de `innodb_page_size`, o tablespace pode conter apenas tabelas com um formato de string não compactado (`COMPACT`, `REDUNDANT` e `DYNAMIC`). As tabelas com um formato de string de `COMPRESSED` têm um tamanho de página física diferente das tabelas não compactadas. Portanto, as tabelas compactadas não podem coexistir no mesmo tablespace com tabelas não compactadas.

Para que um espaço de tabela geral possa conter tabelas comprimidas, deve ser especificado `FILE_BLOCK_SIZE`, e o valor de `FILE_BLOCK_SIZE` deve ser um tamanho de página comprimida válido em relação ao valor de `innodb_page_size`. Além disso, o tamanho de página física da tabela comprimida (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se `innodb_page_size=16K`, e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

* `USE LOGFILE GROUP`: Requerido para `NDB`, este é o nome de um grupo de arquivos de registro previamente criado usando `CREATE LOGFILE GROUP`. Não é suportado para `InnoDB`, onde falha com um erro.

* `EXTENT_SIZE`: Esta opção é específica para NDB e não é suportada pelo InnoDB, onde falha com um erro. `EXTENT_SIZE` define o tamanho, em bytes, dos extensões usados por quaisquer arquivos pertencentes ao espaço de tabelas. O valor padrão é de 1M. O tamanho mínimo é de 32K e o tamanho máximo teórico é de 2G, embora o tamanho máximo prático dependa de vários fatores. Na maioria dos casos, alterar o tamanho da extensão não tem nenhum efeito mensurável no desempenho, e o valor padrão é recomendado para todas as situações, exceto as mais incomuns.

Uma extensão é uma unidade de alocação de espaço em disco. Uma extensão é preenchida com tanto dados quanto essa extensão pode conter antes que outra extensão seja usada. Teoricamente, até 65.535 (64K) extensões podem ser usadas por arquivo de dados; no entanto, o tamanho máximo recomendado é de 32.768 (32K). O tamanho máximo recomendado para um único arquivo de dados é de 32G — ou seja, 32K extensões × 1 MB por extensão. Além disso, uma vez que uma extensão é alocada em uma partição específica, ela não pode ser usada para armazenar dados de uma partição diferente; uma extensão não pode armazenar dados de mais de uma partição. Isso significa, por exemplo, que um espaço de tabelas que tem um único arquivo de dados cujo `INITIAL_SIZE` (descrito no item a seguir) é de 256 MB e cujo `EXTENT_SIZE` é de 128M tem apenas duas extensões, e, portanto, pode ser usado para armazenar dados de no máximo duas partições diferentes da tabela de dados do disco.

Você pode ver quantos extensões permanecem livres em um arquivo de dados específico, consultando a tabela do esquema de informações `FILES`, e, assim, derivar uma estimativa de quanto espaço permanece livre no arquivo. Para discussões adicionais e exemplos, consulte a Seção 24.3.9, “A tabela de arquivos do esquema de informações INFORMATION_SCHEMA”.

* `INITIAL_SIZE`: Esta opção é específica para `NDB`, e não é suportada por `InnoDB`, onde ela falha com um erro.

O parâmetro `INITIAL_SIZE` define o tamanho total em bytes do arquivo de dados que foi especificado usando `ADD DATATFILE`. Uma vez que este arquivo tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais arquivos de dados ao tablespace usando `ALTER TABLESPACE ... ADD DATAFILE`.

`INITIAL_SIZE` é opcional; seu valor padrão é 134217728 (128 MB).

Nos sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB).

* `AUTOEXTEND_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

* `MAX_SIZE`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

* `NODEGROUP`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

* `WAIT`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

* `COMMENT`: Atualmente ignorado pelo MySQL; reservado para uso possível no futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do motor de armazenamento utilizado.

* `ENGINE`: Define o motor de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do motor de armazenamento. Atualmente, apenas o motor de armazenamento `InnoDB` é suportado pelas versões padrão do MySQL 5.7. O MySQL NDB Cluster 7.5 suporta tanto os tablespace `NDB` quanto `InnoDB`. O valor da variável de sistema `default_storage_engine` é usado para `ENGINE` se a opção não for especificada.

#### Notas

* Para as regras que cobrem o nome dos espaços de tabela do MySQL, consulte a Seção 9.2, “Nomes de Objetos do Esquema”. Além dessas regras, o caractere barra (“/”) não é permitido, e você também não pode usar nomes que comecem com `innodb_`, pois esse prefixo é reservado para uso do sistema.

* Os tablespaces não suportam tabelas temporárias.
* As configurações `innodb_file_per_table`, `innodb_file_format` e `innodb_file_format_max` não têm influência nas operações do `CREATE TABLESPACE`. `innodb_file_per_table` não precisa ser habilitado. Os tablespaces gerais suportam todos os formatos de string de tabela, independentemente das configurações do formato de arquivo. Da mesma forma, os tablespaces gerais suportam a adição de tabelas de qualquer formato de string usando `CREATE TABLE ... TABLESPACE`, independentemente das configurações do formato de arquivo.

* `innodb_strict_mode` não é aplicável a espaços de tabela gerais. As regras de gerenciamento de espaços de tabela são rigorosamente aplicadas independentemente de `innodb_strict_mode`. Se os parâmetros de `CREATE TABLESPACE` estiverem incorretos ou incompatíveis, a operação falha, independentemente da configuração de `innodb_strict_mode`. Quando uma tabela é adicionada a um espaço de tabela geral usando `CREATE TABLE ... TABLESPACE` ou `ALTER TABLE ... TABLESPACE`, `innodb_strict_mode` é ignorado, mas a declaração é avaliada como se `innodb_strict_mode` estivesse habilitado.

* Use `DROP TABLESPACE` para remover um espaço de tabelas. Todas as tabelas devem ser excluídas de um espaço de tabelas usando `DROP TABLE` antes de excluir o espaço de tabelas. Antes de excluir um espaço de tabelas de NDB Cluster, você também deve remover todos os seus arquivos de dados usando uma ou mais declarações `ALTER TABLESPACE ... DROP DATATFILE`. Veja a Seção 21.6.11.1, “Objetos de dados de disco de NDB Cluster”.

* Todas as partes de uma tabela `InnoDB` adicionadas a um espaço de tabela geral `InnoDB` residem no espaço de tabela geral, incluindo índices e páginas `BLOB`.

Para uma tabela `NDB` atribuída a um espaço de tabela, apenas as colunas que não são indexadas são armazenadas em disco e, na verdade, utilizam os arquivos de dados do espaço de tabela. Os índices e as colunas indexadas para todas as tabelas `NDB` são mantidos sempre na memória.

* Assim como as tabelas de espaço de sistema, a truncação ou eliminação de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados ibd do espaço de tabelas geral, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

* Um espaço de tabela geral não está associado a nenhum banco de dados ou esquema.

* `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ...IMPORT TABLESPACE` não são suportados para tabelas que pertencem a um espaço de tabelas geral.

* O servidor utiliza bloqueio de metadados de nível de espaço de tabela para DDL que faz referência a espaços de tabela gerais. Em comparação, o servidor utiliza bloqueio de metadados de nível de tabela para DDL que faz referência a espaços de tabela por arquivo.

* Um espaço de tabela gerado ou existente não pode ser alterado para um espaço de tabela geral.

* As tabelas armazenadas em um espaço de tabelas geral só podem ser abertas no MySQL 5.7.6 ou posterior, devido à adição de novos indicadores de tabela.

* Não há conflito entre os nomes de espaço de tabela geral e os nomes de espaço de tabela por arquivo. O caractere “/”, que está presente nos nomes de espaço de tabela por arquivo, não é permitido nos nomes de espaço de tabela geral.

* **mysqldump** e **mysqlpump** não fazem dump das declarações `InnoDB` `CREATE TABLESPACE`

#### Exemplos de InnoDB

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de três tabelas não compactadas de diferentes formatos de string.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

Este exemplo demonstra a criação de um espaço de tabelas geral e a adição de uma tabela comprimida. O exemplo assume um valor padrão de `innodb_page_size` de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela comprimida tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

#### Exemplo de NDB

Suponha que você queira criar um espaço de dados de disco de NDB Cluster chamado `myts` usando um arquivo de dados chamado `mydata-1.dat`. Um espaço de dados `NDB` sempre requer o uso de um grupo de arquivos de log que consistem em um ou mais arquivos de log de desfazer. Para este exemplo, primeiro criamos um grupo de arquivos de log chamado `mylg` que contém um arquivo de longo de desfazer chamado `myundo-1.dat`, usando a declaração `CREATE LOGFILE GROUP` mostrada aqui:

```sql
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Agora, você pode criar o espaço de tabela descrito anteriormente usando a seguinte declaração:

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

Agora, você pode criar uma tabela de dados de disco usando uma declaração `CREATE TABLE` com as opções `TABLESPACE` e `STORAGE DISK`, semelhante ao que é mostrado aqui:

```sql
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

É importante notar que apenas as colunas `dob` e `joined` de `mytable` são armazenadas na verdade no disco, devido ao fato de que as colunas `id`, `lname` e `fname` estão todas indexadas.

Como mencionado anteriormente, quando o `CREATE TABLESPACE` é usado com o `ENGINE [=] NDB`, um espaço de tabela e um arquivo de dados associado são criados em cada nó de dados do NDB Cluster. Você pode verificar se os arquivos de dados foram criados e obter informações sobre eles, realizando uma consulta à tabela do Esquema de Informações `FILES`, conforme mostrado aqui:

```sql
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

Para informações adicionais e exemplos, consulte a Seção 21.6.11.1, “Objetos de dados de disco de cluster NDB”.

### 13.1.20 Declaração de CREATE TRIGGER

```sql
CREATE
    [DEFINER = user]
    TRIGGER trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

Essa declaração cria um novo gatilho. Um gatilho é um objeto de banco de dados com nome que está associado a uma tabela e que é ativado quando um evento específico ocorre para a tabela. O gatilho se torna associado à tabela denominada *`tbl_name`*, que deve se referir a uma tabela permanente. Você não pode associar um gatilho a uma tabela `TEMPORARY` ou a uma visão.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

Esta seção descreve a sintaxe de `CREATE TRIGGER`. Para uma discussão adicional, consulte a Seção 23.3.1, “Sintaxe e Exemplos de Trigêmeo”.

`CREATE TRIGGER` exige o privilégio `TRIGGER` para a tabela associada ao gatilho. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objetos Armazenados”. Se o registro binário estiver habilitado, `CREATE TRIGGER` pode exigir o privilégio `SUPER`, conforme discutido na Seção 23.7, “Registro Binário de Programas Armazenados”.

A cláusula `DEFINER` determina o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da ativação do gatilho, conforme descrito mais adiante nesta seção.

*`trigger_time`* é o tempo de ação do gatilho. Pode ser `BEFORE` ou `AFTER` para indicar que o gatilho é ativado antes ou depois de cada string a ser modificada.

Os verificações básicas de valor de coluna ocorrem antes da ativação do gatilho, portanto, você não pode usar gatilhos `BEFORE` para converter valores inadequados para o tipo de coluna em valores válidos.

*`trigger_event`* indica o tipo de operação que ativa o gatilho. Esses valores *`trigger_event`* são permitidos:

* `INSERT`: O gatilho é ativado sempre que uma nova string é inserida na tabela (por exemplo, através das declarações `INSERT`, `LOAD DATA` e `REPLACE`).

* `UPDATE`: O gatilho é ativado sempre que uma string é modificada (por exemplo, através das instruções `UPDATE`).

* `DELETE`: O gatilho é ativado sempre que uma string é excluída da tabela (por exemplo, através das declarações `DELETE` e `REPLACE`). As declarações `DROP TABLE` e `TRUNCATE TABLE` na tabela *não* ativam este gatilho, porque elas não utilizam `DELETE`. A eliminação de uma partição também não ativa os gatilhos `DELETE`.

O *`trigger_event` não representa um tipo literal de declaração SQL que ativa o gatilho tanto quanto representa um tipo de operação de tabela. Por exemplo, um gatilho `INSERT` não se ativa apenas para declarações `INSERT` mas também para declarações `LOAD DATA`, porque ambas as declarações inserem strings em uma tabela.

Um exemplo potencialmente confuso disso é a sintaxe do `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`: um gatilho `BEFORE INSERT` é ativado para cada string, seguido por um gatilho `AFTER INSERT` ou ambos os gatilhos `BEFORE UPDATE` e `AFTER UPDATE`, dependendo se havia uma chave duplicada para a string.

Nota

As ações de chave estrangeira em cascata não ativam gatilhos.

É possível definir múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e tempo de ação. Por exemplo, é possível ter dois gatilhos `BEFORE UPDATE` para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e tempo de ação são ativados na ordem em que foram criados. Para afetar a ordem do gatilho, especifique uma cláusula *`trigger_order`* que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e tempo de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

*`trigger_body`* é a declaração a ser executada quando o gatilho é ativado. Para executar várias declarações, use a construção de declaração composta `BEGIN ... END`. Isso também permite que você use as mesmas declarações que são permitidas dentro de rotinas armazenadas. Veja a Seção 13.6.1, “BEGIN ... END Declaração Composta”. Algumas declarações não são permitidas em gatilhos; veja a Seção 23.8, “Restrições em Programas Armazenados”.

Dentro do corpo do gatilho, você pode se referir a colunas na tabela do assunto (a tabela associada ao gatilho) usando os aliases `OLD` e `NEW`. `OLD.col_name` refere-se a uma coluna de uma string existente antes de ser atualizada ou excluída. `NEW.col_name` refere-se à coluna de uma nova string a ser inserida ou a uma string existente após ser atualizada.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para se referir a colunas geradas. Para informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

O MySQL armazena a configuração da variável de sistema `sql_mode` em vigor quando um gatilho é criado e sempre executa o corpo do gatilho com essa configuração em vigor, * independentemente do modo SQL do servidor atual quando o gatilho começa a ser executado*.

A cláusula `DEFINER` especifica a conta do MySQL a ser usada ao verificar os privilégios de acesso no momento da ativação do gatilho. Se a cláusula `DEFINER` estiver presente, o valor *`user`* deve ser uma conta do MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores *`user`* permitidos dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objeto Armazenado”. Veja também essa seção para obter informações adicionais sobre a segurança do gatilho.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE TRIGGER`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

O MySQL leva em consideração o usuário `DEFINER` ao verificar os privilégios do gatilho da seguinte forma:

* No momento `CREATE TRIGGER`, o usuário que emite a declaração deve ter o privilégio `TRIGGER`.

* No momento da ativação do gatilho, os privilégios são verificados em relação ao usuário `DEFINER`. Esse usuário deve ter esses privilégios:

+ O privilégio `TRIGGER` para a tabela do sujeito.

+ O privilégio `SELECT` para a tabela do sujeito se as referências às colunas da tabela ocorrerem usando `OLD.col_name` ou `NEW.col_name` no corpo do gatilho.

+ O privilégio `UPDATE` para a tabela do sujeito, se as colunas da tabela forem alvos de atribuições de `SET NEW.col_name = value` no corpo do gatilho.

+ Quaisquer outros privilégios que normalmente são necessários para as declarações executadas pelo gatilho.

Dentro de um corpo de gatilho, a função `CURRENT_USER` retorna a conta usada para verificar privilégios no momento da ativação do gatilho. Esse é o usuário `DEFINER`, não o usuário cujas ações causaram a ativação do gatilho. Para informações sobre auditoria de usuários dentro de gatilhos, consulte a Seção 6.2.18, “Auditorização de atividade de conta baseada em SQL”.

Se você usar `LOCK TABLES` para bloquear uma tabela que tenha gatilhos, as tabelas usadas dentro do gatilho também serão bloqueadas, conforme descrito em LOCK TABLES e Gatilhos.

Para uma discussão adicional sobre o uso de gatilho, consulte a Seção 23.3.1, “Sintaxe e Exemplos de Gatilho”.

### 13.1.21 Declaração de CREATE VIEW

```sql
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

A declaração `CREATE VIEW` cria uma nova visualização ou substitui uma visualização existente, se a cláusula `OR REPLACE` for fornecida. Se a visualização não existir, `CREATE OR REPLACE VIEW` é o mesmo que `CREATE VIEW`. Se a visualização existir, `CREATE OR REPLACE VIEW` a substitui.

Para informações sobre as restrições de uso de visualizações, consulte a Seção 23.9, “Restrições em visualizações”.

O *`select_statement` é uma declaração `SELECT` que fornece a definição da visão. (Selecionar a partir da visão seleciona, na verdade, usando a declaração `SELECT`. O *`select_statement` pode selecionar a partir de tabelas de base ou de outras visões.

A definição de visão é "congelada" no momento da criação e não é afetada por alterações subsequentes nas definições das tabelas subjacentes. Por exemplo, se uma visão é definida como `SELECT *` em uma tabela, novas colunas adicionadas à tabela posteriormente não se tornam parte da visão, e as colunas excluídas da tabela resultam em um erro ao selecionar a partir da visão.

A cláusula `ALGORITHM` afeta a forma como o MySQL processa a visão. As cláusulas `DEFINER` e `SQL SECURITY` especificam o contexto de segurança a ser utilizado ao verificar os privilégios de acesso no momento da invocação da visão. A cláusula `WITH CHECK OPTION` pode ser usada para restringir inserções ou atualizações em strings de tabelas referenciadas pela visão. Essas cláusulas são descritas mais adiante nesta seção.

A declaração `CREATE VIEW` exige o privilégio `CREATE VIEW` para a visão, e alguns privilégios para cada coluna selecionada pela declaração `SELECT`. Para as colunas usadas em outros lugares na declaração `SELECT`, você deve ter o privilégio `SELECT`. Se a cláusula `OR REPLACE` estiver presente, você também deve ter o privilégio `DROP` para a visão. Se a cláusula `DEFINER` estiver presente, os privilégios necessários dependem do valor *`user`*, conforme discutido na Seção 23.6, “Controle de Acesso a Objeto Armazenado”.

Quando uma visão é referenciada, o controle de privilégios ocorre conforme descrito mais adiante nesta seção.

Uma visão pertence a um banco de dados. Por padrão, uma nova visão é criada no banco de dados padrão. Para criar a visão explicitamente em um determinado banco de dados, use a sintaxe *`db_name.view_name`* para qualificar o nome da visão com o nome do banco de dados:

```sql
CREATE VIEW test.v AS SELECT * FROM t;
```

Os nomes de tabela ou de visão não qualificados na declaração `SELECT` também são interpretados em relação ao banco de dados padrão. Uma visão pode se referir a tabelas ou visões em outros bancos de dados, qualificando o nome da tabela ou da visão com o nome do banco de dados apropriado.

Dentro de um banco de dados, as tabelas de base e os pontos de vista compartilham o mesmo espaço de nome, portanto, uma tabela de base e um ponto de vista não podem ter o mesmo nome.

As colunas recuperadas pela declaração `SELECT` podem ser referências simples para colunas de tabela, ou expressões que utilizam funções, valores constantes, operadores, etc.

Uma visão deve ter nomes de coluna únicos, sem duplicatas, assim como uma tabela base. Por padrão, os nomes das colunas recuperados pela declaração `SELECT` são usados para os nomes das colunas da visão. Para definir nomes explícitos para as colunas da visão, especifique a cláusula opcional *`column_list`* como uma lista de identificadores separados por vírgula. O número de nomes em *`column_list`* deve ser o mesmo número de colunas recuperadas pela declaração `SELECT`.

Uma visão pode ser criada a partir de muitos tipos de declarações `SELECT`. Ela pode se referir a tabelas base ou outras visões. Ela pode usar junções, `UNION` e subconsultas. A `SELECT` não precisa nem mesmo se referir a nenhuma tabela:

```sql
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

O exemplo a seguir define uma visão que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

Uma definição de visualização está sujeita às seguintes restrições:

* A declaração `SELECT` não pode se referir a variáveis de sistema ou variáveis definidas pelo usuário.

* Dentro de um programa armazenado, a declaração `SELECT` não pode se referir a parâmetros de programa ou variáveis locais.

* A declaração `SELECT` não pode se referir a parâmetros de declaração preparados.

* Qualquer tabela ou visão referida na definição deve existir. Se, após a criação da visão, uma tabela ou visão a que a definição se refere for excluída, o uso da visão resulta em um erro. Para verificar uma definição de visão em relação a problemas desse tipo, use a declaração `CHECK TABLE`.

* A definição não pode se referir a uma tabela `TEMPORARY`, e você não pode criar uma visão `TEMPORARY`.

* Você não pode associar um gatilho a uma visão. * Alias para os nomes de colunas na declaração `SELECT` são verificados contra o comprimento máximo da coluna de 64 caracteres (não o comprimento máximo do alias de 256 caracteres).

`ORDER BY` é permitido em uma definição de visualização, mas é ignorado se você selecionar de uma visualização usando uma declaração que tem sua própria `ORDER BY`.

Para outras opções ou cláusulas na definição, elas são adicionadas às opções ou cláusulas da declaração que faz referência à visão, mas o efeito é indefinido. Por exemplo, se uma definição de visão inclui uma cláusula `LIMIT`, e você seleciona a partir da visão usando uma declaração que tem sua própria cláusula `LIMIT`, é indefinido qual limite se aplica. Esse mesmo princípio se aplica a opções como `ALL`, `DISTINCT` ou `SQL_SMALL_RESULT` que seguem a palavra-chave `SELECT`, e a cláusulas como `INTO`, `FOR UPDATE`, `LOCK IN SHARE MODE` e `PROCEDURE`.

Os resultados obtidos a partir de uma visão podem ser afetados se você alterar o ambiente de processamento de consulta ao alterar as variáveis do sistema:

```sql
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

As cláusulas `DEFINER` e `SQL SECURITY` determinam qual conta do MySQL usar ao verificar os privilégios de acesso para a visão quando uma declaração é executada que faz referência à visão. Os valores característicos válidos `SQL SECURITY` são `DEFINER` (o padrão) e `INVOKER`. Esses indicam que os privilégios necessários devem ser mantidos pelo usuário que definiu ou invocou a visão, respectivamente.

Se a cláusula `DEFINER` estiver presente, o valor do *`user` deve ser uma conta MySQL especificada como `'user_name'@'host_name'`, `CURRENT_USER` ou `CURRENT_USER()`. Os valores permitidos do *`user` dependem dos privilégios que você possui, conforme discutido na Seção 23.6, “Controle de Acesso a Objeto Armazenado”. Veja também essa seção para obter informações adicionais sobre a segurança da visualização.

Se a cláusula `DEFINER` for omitida, o definidor padrão é o usuário que executa a declaração `CREATE VIEW`. Isso é o mesmo que especificar explicitamente `DEFINER = CURRENT_USER`.

Dentro de uma definição de visão, a função `CURRENT_USER` retorna o valor `DEFINER` da visão por padrão. Para vistas definidas com a característica `SQL SECURITY INVOKER`, `CURRENT_USER` retorna a conta do invocador da visão. Para informações sobre auditoria de usuários dentro de vistas, consulte a Seção 6.2.18, “Auditorização de Atividade de Conta Baseada em SQL”.

Dentro de uma rotina armazenada que é definida com a característica `SQL SECURITY DEFINER`, `CURRENT_USER` retorna o valor da rotina `DEFINER`. Isso também afeta uma visualização definida dentro de tal rotina, se a definição da visualização contiver um valor `DEFINER` de `CURRENT_USER`.

O MySQL verifica os privilégios de visualização da seguinte forma:

* No momento da definição da visão, o criador da visão deve ter os privilégios necessários para usar os objetos de nível superior acessados pela visão. Por exemplo, se a definição da visão se refere a colunas de tabela, o criador deve ter algum privilégio para cada coluna na lista de seleção da definição, e o privilégio `SELECT` para cada coluna usada em outro lugar na definição. Se a definição se refere a uma função armazenada, apenas os privilégios necessários para invocar a função podem ser verificados. Os privilégios necessários no momento da invocação da função podem ser verificados apenas conforme ela é executada: para diferentes invocações, podem ser tomadas diferentes caminhos de execução dentro da função.

* O usuário que faz referência a uma visão deve ter privilégios apropriados para acessá-la (`SELECT` para selecioná-la, `INSERT` para inseri-la, e assim por diante.)

* Quando uma visão foi referenciada, os privilégios dos objetos acessados pela visão são verificados em relação aos privilégios da conta ou invocante da conta `DEFINER`, dependendo se a característica `SQL SECURITY` é `DEFINER` ou `INVOKER`, respectivamente.

* Se a referência a uma visão causar a execução de uma função armazenada, a verificação de privilégios para declarações executadas dentro da função depende se a característica `SQL SECURITY` da função é `DEFINER` ou `INVOKER`. Se a característica de segurança for `DEFINER`, a função é executada com os privilégios da conta `DEFINER`. Se a característica for `INVOKER`, a função é executada com os privilégios determinados pela característica `SQL SECURITY` da visão.

Exemplo: Uma visão pode depender de uma função armazenada, e essa função pode invocar outras rotinas armazenadas. Por exemplo, a seguinte visão invoca uma função armazenada `f()`:

```sql
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suponha que `f()` contenha uma declaração como esta:

```sql
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

Os privilégios necessários para executar declarações dentro de `f()` precisam ser verificados quando `f()` é executado. Isso pode significar que são necessários privilégios para `p1()` ou `p2()`, dependendo do caminho de execução dentro de `f()`. Esses privilégios devem ser verificados em tempo de execução, e o usuário que deve possuir os privilégios é determinado pelos valores de `SQL SECURITY` da vista `v` e da função `f()`.

As cláusulas `DEFINER` e `SQL SECURITY` para vistas são extensões do SQL padrão. No SQL padrão, as vistas são manipuladas usando as regras para `SQL SECURITY DEFINER`. O padrão diz que o definidor da vista, que é o mesmo que o proprietário do esquema da vista, obtém privilégios aplicáveis à vista (por exemplo, `SELECT`) e pode concedê-los. O MySQL não tem conceito de "proprietário" de um esquema, então o MySQL adiciona uma cláusula para identificar o definidor. A cláusula `DEFINER` é uma extensão onde a intenção é ter o que o padrão tem; ou seja, um registro permanente de quem definiu a vista. É por isso que o valor padrão `DEFINER` é a conta do criador da vista.

A cláusula opcional `ALGORITHM` é uma extensão do MySQL ao SQL padrão. Ela afeta a forma como o MySQL processa a visão. `ALGORITHM` assume três valores: `MERGE`, `TEMPTABLE` ou `UNDEFINED`. Para mais informações, consulte a Seção 23.5.2, “Algoritmos de Processamento de Visões”, bem como a Seção 8.2.2.4, “Otimizando Tabelas Derivadas e Referências de Visão com Fusão ou Materialização”.

Alguns pontos de vista são atualizáveis. Isso significa que você pode usá-los em declarações como `UPDATE`, `DELETE` ou `INSERT` para atualizar o conteúdo da tabela subjacente. Para que um ponto de vista seja atualizável, deve haver uma relação um-para-um entre as strings do ponto de vista e as strings da tabela subjacente. Existem também certos outros construtos que tornam um ponto de vista não atualizável.

Uma coluna gerada em uma visualização é considerada atualizável, pois é possível atribuí-la. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

A cláusula `WITH CHECK OPTION` pode ser aplicada a uma visão atualizável para impedir inserções ou atualizações em strings, exceto aquelas para as quais a cláusula `WHERE` no *`select_statement`* é verdadeira.

Em uma cláusula `WITH CHECK OPTION` para uma visão atualizável, as palavras-chave `LOCAL` e `CASCADED` determinam o escopo dos testes de verificação quando a visão é definida em termos de outra visão. A palavra-chave `LOCAL` restringe o `CHECK OPTION` apenas à visão que está sendo definida. `CASCADED` faz com que os controles para visões subjacentes sejam avaliados também. Quando nenhuma das palavras-chave é dada, o padrão é `CASCADED`.

Para mais informações sobre vistas atualizáveis e a cláusula `WITH CHECK OPTION`, consulte a Seção 23.5.3, “Vistas atualizáveis e inseríveis”, e a Seção 23.5.4, “Cláusula VIEW com opção CHECK”.

As vistas criadas antes do MySQL 5.7.3 que contêm `ORDER BY integer` podem resultar em erros no momento da avaliação da vista. Considere essas definições de vista, que utilizam `ORDER BY` com um número ordinal:

```sql
CREATE VIEW v1 AS SELECT x, y, z FROM t ORDER BY 2;
CREATE VIEW v2 AS SELECT x, 1, z FROM t ORDER BY 2;
```

No primeiro caso, `ORDER BY 2` se refere a uma coluna nomeada `y`. No segundo caso, se refere a uma constante 1. Para consultas que selecionam menos de 2 colunas (o número nomeado na cláusula `ORDER BY`, ocorre um erro se o servidor avaliar a visão usando o algoritmo MERGE. Exemplos:

```sql
mysql> SELECT x FROM v1;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
mysql> SELECT x FROM v2;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
```

A partir do MySQL 5.7.3, para lidar com definições de visualizações como essa, o servidor as escreve de maneira diferente no arquivo `.frm`, que armazena a definição da visualização. Essa diferença é visível com `SHOW CREATE VIEW`. Anteriormente, o arquivo `.frm` continha isso para a cláusula `ORDER BY 2`:

```sql
For v1: ORDER BY 2
For v2: ORDER BY 2
```

A partir de 5.7.3, o arquivo `.frm` contém o seguinte:

```sql
For v1: ORDER BY `t`.`y`
For v2: ORDER BY ''
```

Ou seja, para `v1`, 2 é substituído por uma referência ao nome da coluna a que se refere. Para `v2`, 2 é substituído por uma expressão de cadeia constante (ordenar por uma constante não tem efeito, então ordenar por qualquer constante funciona).

Se você estiver enfrentando erros de avaliação de visualização, como os descritos acima, elimine e recrie a visualização para que o arquivo `.frm` contenha a representação da visualização atualizada. Alternativamente, para visualizações como `v2` que ordenam por um valor constante, elimine e recrie a visualização sem a cláusula `ORDER BY`.

### 13.1.22 Declaração DROP DATABASE

```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` elimina todas as tabelas do banco de dados e exclui o banco de dados. Este comando deve ser usado com **muito cuidado**! Para usar `DROP DATABASE`, é necessário o privilégio `DROP` no banco de dados. `DROP SCHEMA` é sinônimo de `DROP DATABASE`.

Importante

Quando um banco de dados é excluído, os privilégios concedidos especificamente para o banco de dados não são excluídos automaticamente. Eles devem ser excluídos manualmente. Veja a Seção 13.7.1.4, “Declaração GRANT”.

`IF EXISTS` é usado para evitar que um erro ocorra se o banco de dados não existir.

Se o banco de dados padrão for excluído, o banco de dados padrão será desativado (a função `DATABASE()` retorna `NULL`).

Se você usar `DROP DATABASE` em um banco de dados vinculado de forma simbólica, tanto o link quanto o banco de dados original serão excluídos.

`DROP DATABASE` retorna o número de tabelas que foram removidas. Isso corresponde ao número de arquivos removidos `.frm`.

A declaração `DROP DATABASE` remove do diretório do banco de dados dado aqueles arquivos e diretórios que o próprio MySQL pode criar durante o funcionamento normal:

* Todos os arquivos com as seguintes extensões:

+ `.BAK`
+ `.DAT`
+ `.HSH`
+ `.MRG`
+ `.MYD`
+ `.MYI`
+ `.TRG`
+ `.TRN`
+ `.cfg`
+ `.db`
+ `.frm`
+ `.ibd`
+ `.ndb`
+ `.par`
* O arquivo `db.opt`, se existir.

Se outros arquivos ou diretórios permanecerem no diretório do banco de dados após o MySQL remover os que foram listados, o diretório do banco de dados não pode ser removido. Nesse caso, você deve remover manualmente quaisquer arquivos ou diretórios restantes e emitir a declaração `DROP DATABASE` novamente.

A eliminação de um banco de dados não remove quaisquer `TEMPORARY` que foram criados nesse banco de dados. As tabelas `TEMPORARY` são removidas automaticamente quando a sessão que as criou termina. Veja a Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”.

Você também pode excluir bancos de dados com o **mysqladmin**. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

### 13.1.23 Declaração de Evento de RETIREAMENTO

```sql
DROP EVENT [IF EXISTS] event_name
```

Essa declaração exclui o evento denominado *`event_name`*. O evento imediatamente deixa de ser ativo e é completamente excluído do servidor.

Se o evento não existir, o erro ERROR 1517 (HY000) resulta. Você pode ignorar isso e fazer com que a declaração gere um aviso para eventos inexistentes, em vez disso, usando `IF EXISTS`.

Essa declaração exige o privilégio `EVENT` para o esquema ao qual o evento a ser excluído pertence.

### 13.1.24 Declaração da função DROP

A declaração `DROP FUNCTION` é usada para descartar funções armazenadas e funções carregáveis:

* Para informações sobre a eliminação de funções armazenadas, consulte a Seção 13.1.27, “Instruções DROP PROCEDURE e DROP FUNCTION”.

* Para informações sobre a eliminação de funções carregáveis, consulte a Seção 13.7.3.2, “Instrução DROP FUNCTION para Funções Carregáveis”.

### 13.1.25 Declaração DROP INDEX

```sql
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

`DROP INDEX` elimina o índice denominado *`index_name`* da tabela *`tbl_name`. Esta declaração é mapeada a uma declaração `ALTER TABLE` para eliminar o índice. Veja a Seção 13.1.8, “Declaração ALTER TABLE”.

Para descartar uma chave primária, o nome do índice é sempre `PRIMARY`, que deve ser especificado como um identificador citado porque `PRIMARY` é uma palavra reservada:

```sql
DROP INDEX `PRIMARY` ON t;
```

Os índices em colunas de largura variável das tabelas de `NDB` são removidos online, ou seja, sem qualquer cópia de tabela. A tabela não é bloqueada contra acesso de outros nós da API do NDB Cluster, embora seja bloqueada contra outras operações no *mesmo* nó da API durante a duração da operação. Isso é feito automaticamente pelo servidor sempre que ele determinar que é possível fazê-lo; você não precisa usar qualquer sintaxe SQL especial ou opções do servidor para fazer isso acontecer.

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a declaração `ALTER TABLE`. Para mais informações, consulte a Seção 13.1.8, “Declaração ALTER TABLE”

O NDB Cluster anteriormente suportava operações online `DROP INDEX` usando as palavras-chave `ONLINE` e `OFFLINE`. Essas palavras-chave não são mais suportadas no MySQL NDB Cluster 7.5 e posteriores, e seu uso causa um erro de sintaxe. Em vez disso, o MySQL NDB Cluster 7.5 e posteriores suportam operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte a Seção 21.6.12, “Operações Online com ALTER TABLE no NDB Cluster”, para mais informações.

### 13.1.26 Declaração DROP LOGFILE GROUP

```sql
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

Essa declaração exclui o grupo de arquivos de registro denominado *`logfile_group`*. O grupo de arquivos de registro deve já existir ou ocorrerá um erro. (Para informações sobre a criação de grupos de arquivos de registro, consulte a Seção 13.1.15, “Declaração CREATE LOGFILE GROUP”.)

Importante

Antes de descartar um grupo de arquivos de registro, você deve descartar todos os espaços de tabela que utilizam esse grupo de arquivos de registro para o registro `UNDO`.

A cláusula `ENGINE` necessária fornece o nome do motor de armazenamento usado pelo grupo de arquivos de registro a ser excluído. Atualmente, os únicos valores permitidos para *`engine_name`* são `NDB` e `NDBCLUSTER`.

`DROP LOGFILE GROUP` é útil apenas com armazenamento de dados de disco para NDB Cluster. Veja a Seção 21.6.11, “Tabelas de dados de disco do NDB Cluster”.

### 13.1.27 Declarações de DROP PROCEDURE e DROP FUNCTION

```sql
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

Essas declarações são usadas para descartar uma rotina armazenada (um procedimento ou função armazenada). Ou seja, a rotina especificada é removida do servidor. (`DROP FUNCTION` também é usado para descartar funções carregáveis; veja Seção 13.7.3.2, “Declaração DROP FUNCTION para Funções Carregáveis”.)

Para descartar uma rotina armazenada, você deve ter o privilégio `ALTER ROUTINE` para isso. (Se a variável de sistema `automatic_sp_privileges` estiver habilitada, esse privilégio e `EXECUTE` são concedidos automaticamente ao criador da rotina quando a rotina é criada e descartada pelo criador quando a rotina é descartada. Veja a Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.)

A cláusula `IF EXISTS` é uma extensão do MySQL. Ela previne que um erro ocorra se o procedimento ou a função não existir. Um aviso é produzido que pode ser visualizado com `SHOW WARNINGS`.

`DROP FUNCTION` também é usado para descartar funções carregáveis (consulte a Seção 13.7.3.2, “Declaração DROP FUNCTION para Funções Carregáveis”).

### 13.1.28 Declaração DROP SERVER

```sql
DROP SERVER [ IF EXISTS ] server_name
```

Descarta a definição do servidor para o servidor denominado `server_name`. A string correspondente na tabela `mysql.servers` é excluída. Esta declaração requer o privilégio `SUPER`.

A eliminação de um servidor para uma tabela não afeta quaisquer tabelas `FEDERATED` que utilizaram essas informações de conexão quando foram criadas. Veja a Seção 13.1.17, “Declaração CREATE SERVER”.

`DROP SERVER` causa um commit implícito. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

`DROP SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo utilizado.

### 13.1.29 Declaração DROP TABLE

```sql
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

`DROP TABLE` remove uma ou mais tabelas. Você deve ter o privilégio `DROP` para cada tabela.

*Cuidado* com essa declaração! Para cada tabela, ela remove a definição da tabela e todos os dados da tabela. Se a tabela estiver particionada, a declaração remove a definição da tabela, todas as suas partições, todos os dados armazenados nessas partições e todas as definições de partição associadas à tabela eliminada.

Ao descartar uma tabela, você também descartará quaisquer gatilhos para a tabela.

`DROP TABLE` causa um commit implícito, exceto quando usado com a palavra-chave `TEMPORARY`. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

Importante

Quando uma tabela é eliminada, os privilégios concedidos especificamente para a tabela não são eliminados automaticamente. Eles devem ser eliminados manualmente. Veja a Seção 13.7.1.4, “Declaração GRANT”.

Se quaisquer tabelas mencionadas na lista de argumentos não existirem, o comportamento do `DROP TABLE` depende de se a cláusula `IF EXISTS` é dada:

* Sem `IF EXISTS`, a declaração elimina todas as tabelas nomeadas que existem e retorna um erro indicando quais tabelas não existentes não conseguiu eliminar.

* Com `IF EXISTS`, não ocorre erro para tabelas não existentes. A declaração elimina todas as tabelas nomeadas que existem e gera um diagnóstico `NOTE` para cada tabela inexistente. Essas notas podem ser exibidas com `SHOW WARNINGS`. Veja a Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

`IF EXISTS` também pode ser útil para descartar tabelas em circunstâncias incomuns em que existe um arquivo `.frm`, mas sem uma tabela gerenciada pelo motor de armazenamento. (Por exemplo, se uma saída anormal do servidor ocorrer após a remoção da tabela do motor de armazenamento, mas antes da remoção do arquivo `.frm`.

A palavra-chave `TEMPORARY` tem os seguintes efeitos:

* A declaração exclui apenas as tabelas `TEMPORARY`.
* A declaração não causa um compromisso implícito.
* Não são verificados direitos de acesso. Uma tabela `TEMPORARY` é visível apenas com a sessão que a criou, portanto, não é necessária nenhuma verificação.

Incluir a palavra-chave `TEMPORARY` é uma boa maneira de evitar a queda acidental de tabelas que não são `TEMPORARY`.

As palavras-chave `RESTRICT` e `CASCADE` não fazem nada. Elas são permitidas para facilitar a portar de outros sistemas de banco de dados.

`DROP TABLE` não é suportado com todas as configurações de `innodb_force_recovery`. Veja a Seção 14.22.2, “Forçando a recuperação do InnoDB”.

### 13.1.30 Declaração DROP TABLESPACE

```sql
DROP TABLESPACE tablespace_name
    [ENGINE [=] engine_name]
```

Essa declaração exclui um tablespace que foi criado anteriormente usando `CREATE TABLESPACE`. É compatível com todas as versões do MySQL NDB Cluster 7.5 e também com `InnoDB` no MySQL Server padrão.

`ENGINE` define o mecanismo de armazenamento que utiliza o tablespace, onde *`engine_name`* é o nome do mecanismo de armazenamento. Atualmente, os valores `InnoDB` e `NDB` são suportados. Se não for definido, o valor de `default_storage_engine` é usado. Se não for o mesmo que o mecanismo de armazenamento utilizado para criar o tablespace, a declaração `DROP TABLESPACE` falha.

Para um espaço de tabela `InnoDB`, todas as tabelas devem ser excluídas do espaço de tabela antes de uma operação `DROP TABLESPACE`. Se o espaço de tabela não estiver vazio, `DROP TABLESPACE` retorna um erro.

Assim como as tabelas de espaço de tabela `InnoDB`, ao truncar ou descartar tabelas `InnoDB` armazenadas em um espaço de tabela geral, o espaço livre no arquivo de dados .ibd do espaço de tabela é liberado, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta ao sistema operacional por operações como as de espaços de tabela por arquivo, por exemplo.

Um espaço de tabela `NDB` que deve ser excluído não pode conter quaisquer arquivos de dados; em outras palavras, antes de poder excluir um espaço de tabela `NDB`, você deve primeiro excluir cada um de seus arquivos de dados usando `ALTER TABLESPACE ... DROP DATAFILE`.

#### Notas

* Os tablespaces não são excluídos automaticamente. Um tablespace deve ser excluído explicitamente usando `DROP TABLESPACE`. `DROP DATABASE` não tem efeito nesse sentido, mesmo que a operação exclua todas as tabelas pertencentes ao tablespace.

* Uma operação `DROP DATABASE` pode descartar tabelas que pertencem a um espaço de tabelas geral, mas não pode descartar o espaço de tabelas, mesmo que a operação descarte todas as tabelas que pertencem ao espaço de tabelas. O espaço de tabelas deve ser descartado explicitamente usando `DROP TABLESPACE tablespace_name`.

* Assim como as tabelas de espaço de sistema, a truncação ou eliminação de tabelas armazenadas em um espaço de tabelas geral cria espaço livre internamente no arquivo de dados ibd do espaço de tabelas geral, que só pode ser usado para novos dados do `InnoDB`. O espaço não é liberado de volta ao sistema operacional, como acontece com os espaços de tabelas por arquivo.

#### Exemplo de InnoDB

Este exemplo demonstra como descartar um espaço de tabela geral `InnoDB`. O espaço de tabela geral `ts1` é criado com uma única tabela. Antes de descartar o espaço de tabela, a tabela deve ser descartada.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

#### Exemplo de NDB

Este exemplo mostra como descartar um espaço de tabela `NDB` `myts`, com um arquivo de dados denominado `mydata-1.dat`, após criar primeiro o espaço de tabela, e assume a existência de um grupo de arquivos de registro denominado `mylg` (consulte Seção 13.1.15, “Instrução CREATE LOGFILE GROUP”).

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

Você deve remover todos os arquivos de dados dos espaços de tabela usando `ALTER TABLESPACE`, conforme mostrado aqui, antes que ele possa ser descartado:

```sql
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat'
    ->     ENGINE=NDB;

mysql> DROP TABLESPACE myts;
```

### 13.1.31 Declaração de DROP TRIGGER

```sql
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Essa declaração elimina um gatilho. O nome do esquema (banco de dados) é opcional. Se o esquema for omitido, o gatilho será eliminado do esquema padrão. `DROP TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

Use `IF EXISTS` para evitar que um erro ocorra para um gatilho que não existe. Um `NOTE` é gerado para um gatilho inexistente ao usar `IF EXISTS`. Veja a Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

Os gatilhos de uma tabela também são eliminados se você eliminar a tabela.

### 13.1.32 Declaração de DROP VIEW

```sql
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` remove uma ou mais visualizações. Você deve ter o privilégio `DROP` para cada visualização.

Se quaisquer vistas nomeadas na lista de argumentos não existirem, a declaração retorna um erro indicando, por nome, quais vistas não existentes não conseguiu descartar, mas também descarta todas as vistas na lista que existem.

Nota

No MySQL 8.0, `DROP VIEW` falha se quaisquer vistas nomeadas na lista de argumentos não existirem. Devido à mudança de comportamento, uma operação `DROP VIEW` parcialmente concluída em uma fonte MySQL 5.7 falha quando replicada para uma réplica MySQL 8.0. Para evitar esse cenário de falha, use a sintaxe `IF EXISTS` nas instruções `DROP VIEW` para evitar que um erro ocorra para vistas que não existem. Para mais informações, consulte Suporte à Declaração de Definição de Dados Atômica.

A cláusula `IF EXISTS` previne que um erro ocorra em visualizações que não existem. Quando essa cláusula é fornecida, um `NOTE` é gerado para cada visualização inexistente. Veja a Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

`RESTRICT` e `CASCADE`, se forem fornecidos, são analisados e ignorados.

### 13.1.33 Declaração de RENOMEAR Tabela

```sql
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

`RENAME TABLE` renomeia uma ou mais tabelas. Você deve ter os privilégios `ALTER` e `DROP` para a tabela original e os privilégios `CREATE` e `INSERT` para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta declaração:

```sql
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração `ALTER TABLE`:

```sql
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, ao contrário de `ALTER TABLE`, pode renomear várias tabelas em uma única declaração:

```sql
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas de esquerda para direita. Assim, para trocar dois nomes de tabela, faça isso (assumindo que uma tabela com o nome intermediário `tmp_table` não exista já):

```sql
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

As chaves de metadados em tabelas são adquiridas em ordem de nome, o que, em alguns casos, pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente. Veja a Seção 8.11.4, “Bloqueio de Metadados”.

Para executar `RENAME TABLE`, não deve haver transações ou tabelas ativas bloqueadas com `LOCK TABLES`. Com as condições de bloqueio de tabelas de transação satisfeitas, a operação de renomeação é feita de forma atômica; nenhuma outra sessão pode acessar nenhuma das tabelas enquanto o renomeamento estiver em andamento.

Se houver algum erro durante um `RENAME TABLE`, a declaração falha e não são feitas alterações.

Você pode usar `RENAME TABLE` para mover uma tabela de um banco de dados para outro:

```sql
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Usar esse método para mover todas as tabelas de um banco de dados para outro, na verdade, renomeia o banco de dados (uma operação para a qual o MySQL não tem uma única declaração), exceto que o banco de dados original continua a existir, embora sem tabelas.

Assim como `RENAME TABLE`, `ALTER TABLE ... RENAME` também pode ser usado para mover uma tabela para um banco de dados diferente. Independentemente da declaração usada, se a operação de renomeamento mover a tabela para um banco de dados localizado em um sistema de arquivos diferente, o sucesso do resultado é específico da plataforma e depende das chamadas de sistema operacional subjacentes usadas para mover arquivos de tabela.

Se uma tabela tiver gatilhos, as tentativas de renomear a tabela para um banco de dados diferente falham com um erro de Trigger no esquema errado (`ER_TRG_IN_WRONG_SCHEMA`).

Para renomear as tabelas de `TEMPORARY`, `RENAME TABLE` não funciona. Use `ALTER TABLE` em vez disso.

`RENAME TABLE` funciona para visualizações, exceto que as visualizações não podem ser renomeadas em um banco de dados diferente.

Quaisquer privilégios concedidos especificamente para uma tabela ou visão renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes internos de restrições de chave estrangeira e os nomes de restrições de chave estrangeira definidos pelo usuário que começam com a string “*`tbl_name`*\_ibfk\_” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes de restrições de chave estrangeira que começam com a string “*`tbl_name`*\_ibfk\_” como nomes gerados internamente.

Os nomes das restrições de chave estrangeira que apontam para a tabela renomeada são atualizados automaticamente, a menos que haja um conflito, caso em que a declaração falha com um erro. Um conflito ocorre se o nome da restrição renomeada já existir. Nesses casos, você deve descartar e recriar as chaves estrangeiras para que elas funcionem corretamente.

### 13.1.34 Declaração `TRUNCATE TABLE`

```sql
TRUNCATE [TABLE] tbl_name
```

`TRUNCATE TABLE` esvazia uma tabela completamente. Requer o privilégio `DROP`.

Logicamente, `TRUNCATE TABLE` é semelhante a uma declaração `DELETE` que exclui todas as strings, ou uma sequência de declarações `DROP TABLE` e `CREATE TABLE`. Para alcançar alto desempenho, ela contorna o método DML de exclusão de dados. Assim, não pode ser revertida, não causa o disparo de gatilhos `ON DELETE` e não pode ser realizada para tabelas `InnoDB` com relações de chave estrangeira pai-filho.

Embora `TRUNCATE TABLE` seja semelhante a `DELETE`, é classificado como uma declaração DDL em vez de uma declaração DML. Difere de `DELETE` nas seguintes maneiras:

* Operações de truncar e recriar a tabela são muito mais rápidas do que a exclusão de strings uma a uma, especialmente para tabelas grandes.

As operações de truncação causam um compromisso implícito e, portanto, não podem ser revertidas. Veja a Seção 13.3.3, “Declarações que causam um compromisso implícito”.

* As operações de truncação não podem ser realizadas se a sessão tiver um bloqueio de tabela ativo.

* `TRUNCATE TABLE` falha para uma tabela `InnoDB` ou tabela `NDB` se houver quaisquer restrições `FOREIGN KEY` de outras tabelas que fazem referência à tabela. Restrições de chave estrangeira entre colunas da mesma tabela são permitidas.

* As operações de truncação não retornam um valor significativo para o número de strings excluídas. O resultado usual é "0 strings afetadas", que deve ser interpretado como "nenhuma informação".

* Enquanto o arquivo de formato de tabela `tbl_name.frm` estiver válido, a tabela pode ser recriada como uma tabela vazia com `TRUNCATE TABLE`, mesmo que os arquivos de dados ou de índice tenham se corrompido.

* Qualquer valor de `AUTO_INCREMENT` é redefinido para seu valor inicial. Isso é verdadeiro mesmo para `MyISAM` e `InnoDB`, que normalmente não reutilizam valores de sequência.

* Quando usado com tabelas particionadas, `TRUNCATE TABLE` preserva a partição; ou seja, os arquivos de dados e de índice são eliminados e recriados, enquanto o arquivo de definição de partição (`.par`) não é afetado.

* A declaração `TRUNCATE TABLE` não invoca os gatilhos `ON DELETE`.

`TRUNCATE TABLE` é tratado para fins de registro binário e replicação como DDL e não DML, e é sempre registrado como uma declaração.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Em um sistema com um grande pool de buffer `InnoDB` e `innodb_adaptive_hash_index` habilitado, as operações de `TRUNCATE TABLE` podem causar uma queda temporária no desempenho do sistema devido a uma varredura LRU que ocorre ao remover entradas de índice de hash adaptativo de uma tabela `InnoDB`. O problema foi resolvido para `DROP TABLE` no MySQL 5.5.23 (Bug #13704145, Bug #64284), mas permanece um problema conhecido para `TRUNCATE TABLE` (Bug #68184).

`TRUNCATE TABLE` pode ser usado com as tabelas de resumo do Schema de Desempenho, mas o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não para remover strings. Veja a Seção 25.12.15, “Tabelas de Resumo do Schema de Desempenho”.