### 13.1.8 Declaração ALTER TABLE

13.1.8.1 Operações de Partição de Tabela

13.1.8.2 ALTER TABLE e Colunas Geradas

13.1.8.3 Exemplos de ALTER TABLE

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

- Para usar `ALTER TABLE`, você precisa de privilégios de `ALTER`, `CREATE` e `INSERT` para a tabela. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `ALTER`, `CREATE` e `INSERT` na nova tabela.

- Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for fornecida, `ALTER TABLE` não faz nada.

- A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da instrução `CREATE TABLE`. As cláusulas *`column_definition`* usam a mesma sintaxe para `ADD` e `CHANGE` que para `CREATE TABLE`. Para mais informações, consulte Seção 13.1.18, “Instrução CREATE TABLE”.

- A palavra `COLUNA` é opcional e pode ser omitida.

- Várias cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única instrução `ALTER TABLE`, separadas por vírgulas. Esta é uma extensão do MySQL ao SQL padrão, que permite apenas uma cláusula de cada vez por instrução `ALTER TABLE`. Por exemplo, para descartar várias colunas em uma única instrução, faça o seguinte:

  ```sql
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

- Se um mecanismo de armazenamento não suportar uma operação de tentativa de operação `ALTER TABLE`, pode resultar um aviso. Tais avisos podem ser exibidos com `SHOW WARNINGS`. Consulte Seção 13.7.5.40, “Instrução SHOW WARNINGS”. Para informações sobre a solução de problemas com `ALTER TABLE`, consulte Seção B.3.6.1, “Problemas com ALTER TABLE”.

- Para obter informações sobre colunas geradas, consulte Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”.

- Para exemplos de uso, consulte Seção 13.1.8.3, “Exemplos de ALTER TABLE”.

- Com a função `mysql_info()` da API C, você pode descobrir quantos registros foram copiados pelo `ALTER TABLE` (`alter-table.html`). Veja mysql\_info().

Há vários aspectos adicionais da instrução `ALTER TABLE`, descritos nos tópicos a seguir nesta seção:

- Opções de tabela
- Requisitos de desempenho e espaço
- Controle de Concorrência
- Adicionar e Remover Colunas
- Renomear, redefinir e reorganizar colunas (alter-table.html#alter-table-redefine-column)
- Chaves Primárias e Índices
- Chaves Estrangeiras e Outras Restrições
- Alterar o conjunto de caracteres
- Descartar e importar espaços de tabela InnoDB
- Ordem de Linhas para Tabelas MyISAM
- Opções de Partição

#### Opções da tabela

*`table_options`* indica as opções de tabela do tipo que podem ser usadas na declaração `CREATE TABLE`, como `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT` ou `TABLESPACE`.

Para descrições de todas as opções de tabela, consulte Seção 13.1.18, “Instrução CREATE TABLE”. No entanto, `ALTER TABLE` ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. `ALTER TABLE` permite que eles apenas como opções de particionamento e, a partir do MySQL 5.7.17, exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com `ALTER TABLE` oferece uma maneira conveniente de alterar características individuais de uma tabela. Por exemplo:

- Se `t1` atualmente não for uma tabela `InnoDB`, essa instrução altera seu mecanismo de armazenamento para \`InnoDB:

  ```sql
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  - Consulte Seção 14.6.1.5, “Conversão de tabelas de MyISAM para InnoDB” para obter considerações sobre a conversão de tabelas para o mecanismo de armazenamento `InnoDB`.

  - Quando você especifica uma cláusula `ENGINE`, o `ALTER TABLE` reconstrui a tabela. Isso é verdadeiro mesmo que a tabela já tenha o motor de armazenamento especificado.

  - Executar `ALTER TABLE tbl_name ENGINE=INNODB` em uma tabela `InnoDB` existente realiza uma operação de `ALTER TABLE` (alter-table.html) “nulo”, que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito em Seção 14.12.4, “Desfragmentando uma Tabela”. Executar `ALTER TABLE tbl_name FORCE` em uma tabela `InnoDB` realiza a mesma função.

  - `ALTER TABLE tbl_name ENGINE=INNODB` e `ALTER TABLE tbl_name FORCE` usam DDL online. Para mais informações, consulte Seção 14.13, “InnoDB e DDL online”.

  - O resultado da tentativa de alterar o motor de armazenamento de uma tabela depende se o motor de armazenamento desejado está disponível e da configuração do modo SQL `NO_ENGINE_SUBSTITUTION`, conforme descrito na Seção 5.1.10, "Modos SQL do Servidor".

  - Para evitar a perda acidental de dados, a instrução `ALTER TABLE` não pode ser usada para alterar o mecanismo de armazenamento de uma tabela para `MERGE` ou `BLACKHOLE`.

- Para alterar a tabela `InnoDB` para usar o formato de armazenamento de linhas compactado:

  ```sql
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

- Para habilitar ou desabilitar a criptografia para uma tabela `InnoDB` em um espaço de tabelas por arquivo:

  ```sql
  ALTER TABLE t1 ENCRYPTION='Y';
  ALTER TABLE t1 ENCRYPTION='N';
  ```

  Um plugin de chave de fenda deve ser instalado e configurado para usar a opção `ENCRYPTION`. Para mais informações, consulte Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

  A opção `ENCRYPTION` é suportada apenas pelo mecanismo de armazenamento `InnoDB`; portanto, ela só funciona se a tabela já estiver usando `InnoDB` (e você não alterar o mecanismo de armazenamento da tabela) ou se a instrução `ALTER TABLE` especificar também `ENGINE=InnoDB`. Caso contrário, a instrução será rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

- Para redefinir o valor de incremento automático atual:

  ```sql
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

  Você não pode redefinir o contador para um valor menor ou igual ao valor que está atualmente em uso. Para o `InnoDB` e o `MyISAM`, se o valor for menor ou igual ao valor máximo atualmente na coluna `AUTO_INCREMENT`, o valor é redefinido para o valor atual da coluna `AUTO_INCREMENT` mais um.

- Para alterar o conjunto de caracteres padrão da tabela:

  ```sql
  ALTER TABLE t1 CHARACTER SET = utf8;
  ```

  Veja também Alterar o conjunto de caracteres.

- Para adicionar (ou alterar) um comentário de tabela:

  ```sql
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

- Use `ALTER TABLE` com a opção `TABLESPACE` para mover tabelas `InnoDB` entre espaços de tabelas existentes (espaços de tabelas gerais, espaços de tabelas por arquivo e o espaço de tabelas do sistema). Veja Mover tabelas entre espaços de tabelas usando ALTER TABLE.

  - As operações `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

  - A sintaxe `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

  - A cláusula `DATA DIRECTORY`, que é suportada com `CREATE TABLE ... TABLESPACE`, não é suportada com `ALTER TABLE ... TABLESPACE` e é ignorada se especificada.

  - Para obter mais informações sobre as capacidades e limitações da opção `TABLESPACE`, consulte `CREATE TABLE`.

- O MySQL NDB Cluster 7.5.2 e versões posteriores suportam a definição das opções `NDB_TABLE` para controlar o equilíbrio de partições de uma tabela (tipo de contagem de fragmentos), a capacidade de leitura de qualquer replica, replicação completa ou qualquer combinação dessas opções, como parte do comentário da tabela para uma instrução `ALTER TABLE` da mesma maneira que para `CREATE TABLE`, conforme mostrado neste exemplo:

  ```sql
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  É também possível definir opções `NDB_COMMENT` para colunas de tabelas de `NDB` como parte de uma instrução `ALTER TABLE`, como esta:

  ```sql
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=MAX_BLOB_PART_SIZE';
  ```

  Tenha em mente que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte Definir opções de NDB\_TABLE para obter informações e exemplos adicionais.

Para verificar se as opções da tabela foram alteradas conforme o esperado, use `SHOW CREATE TABLE` ou consulte a tabela do Schema de Informações `TABLES`.

#### Requisitos de desempenho e espaço

As operações de `ALTER TABLE` são processadas usando um dos seguintes algoritmos:

- `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova tabela linha por linha. O DML concorrente não é permitido.

- `INPLACE`: As operações evitam a cópia dos dados da tabela, mas podem reconstruí-la no local. Pode ser realizada uma bloqueio exclusivo de metadados na tabela por um breve período durante as fases de preparação e execução da operação. Normalmente, o DML concorrente é suportado.

Para tabelas que utilizam o mecanismo de armazenamento `NDB`, esses algoritmos funcionam da seguinte forma:

- `COPY`: O `NDB` cria uma cópia da tabela e a altera; o manipulador do NDB Cluster então copia os dados entre as versões antigas e novas da tabela. Posteriormente, o `NDB` exclui a tabela antiga e renomeia a nova.

  Isso é às vezes chamado de "cópia" ou "ALTER TABLE" "offline".

- `INPLACE`: Os nós de dados fazem as alterações necessárias; o manipulador do NDB Cluster não copia dados ou participa de outra forma.

  Isso é às vezes chamado de "ALTER TABLE" "não de cópia" ou "online".

Para obter mais informações, consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INPLACE` para os motores de armazenamento e as cláusulas de `ALTER TABLE` que a suportam. Caso contrário, é usado `ALGORITHM=COPY`.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para cláusulas e motores de armazenamento que o suportem, ou falhará com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula `ALGORITHM`.

As operações de alteração de tabela (`ALTER TABLE`) que utilizam o algoritmo `COPY` aguardam que outras operações que estão modificando a tabela sejam concluídas. Após as alterações serem aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação de alteração de tabela (`ALTER TABLE`) está sendo executada, a tabela original pode ser lida por outras sessões (com a exceção mencionada brevemente). As atualizações e escritas na tabela iniciadas após o início da operação de alteração de tabela (`ALTER TABLE`) são interrompidas até que a nova tabela esteja pronta, e então são automaticamente redirecionadas para a nova tabela. A cópia temporária da tabela é criada no diretório do banco de dados da tabela original, a menos que seja uma operação `RENAME TO` que mova a tabela para um banco de dados que reside em um diretório diferente.

A exceção mencionada anteriormente é que os bloqueios de leitura `ALTER TABLE` bloqueiam leituras (não apenas escritas) no ponto em que estão prontos para instalar uma nova versão do arquivo `.frm` da tabela. Nesse ponto, ele deve adquirir um bloqueio exclusivo. Para isso, ele aguarda que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação de `ALTER TABLE` que usa o algoritmo `COPY` impede operações concorrentes de DML. As consultas concorrentes ainda são permitidas. Ou seja, uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permite consultas, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK`, especificando `LOCK=EXCLUSIVE`, o que impede DML e consultas. Para mais informações, consulte Controle de Concorrência.

Para forçar o uso do algoritmo `COPY` para uma operação de `ALTER TABLE` que, de outra forma, não o usaria, habilite a variável de sistema `old_alter_table` (alter-table.html ou especifique `ALGORITHM=COPY`. Se houver um conflito entre o ajuste `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` terá precedência.

Para tabelas do `InnoDB`, uma operação de `ALTER TABLE` que usa o algoritmo `COPY` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações exigem tanto espaço adicional quanto os dados da tabela mais os índices. Para uma tabela que reside em um espaço de tabelas compartilhado, o espaço adicional usado durante a operação não é liberado de volta ao sistema operacional, como acontece com uma tabela que reside em um espaço de tabelas `file-per-table` (glossary.html#glos\_file\_per\_table).

Para obter informações sobre os requisitos de espaço para operações DDL online, consulte Seção 14.13.3, “Requisitos de Espaço DDL Online”.

As operações de alteração de tabela (`ALTER TABLE`) que suportam o algoritmo `INPLACE` incluem:

- As operações `ALTER TABLE` suportadas pelo recurso `InnoDB` DDL online. Consulte Seção 14.13.1, "Operações de DDL online".

- Renomear uma tabela. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Veja Seção 13.1.33, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

- Operações que apenas modificam os metadados da tabela. Essas operações são imediatas porque o servidor altera apenas o arquivo `.frm` da tabela, sem tocar no conteúdo da tabela. As operações que alteram apenas os metadados incluem:

  - Renomear uma coluna.

  - Alterar o valor padrão de uma coluna (exceto para tabelas de `NDB`.

  - Modificar a definição de uma coluna `[ENUM]` ou `[SET]` adicionando novos membros da enumeração ou do conjunto ao `[fim]` da lista de valores de membro válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `[SET]` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a reenumeração dos membros existentes, o que requer uma cópia da tabela.

- Renomear um índice.

- Adicionar ou remover um índice secundário para as tabelas de `InnoDB` e `NDB`. Consulte Seção 14.13, “InnoDB e DDL Online”.

- Para as tabelas `[`NDB\`]\(mysql-cluster.html), operações que adicionam e excluem índices em colunas de largura variável. Essas operações ocorrem online, sem cópia da tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Veja Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

`ALTER TABLE` atualiza as colunas temporais do MySQL 5.5 para o formato 5.6 para as operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser feita usando o algoritmo `INPLACE` porque a tabela deve ser reconstruída, portanto, especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um índice de várias colunas usado para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só pode ser realizada usando `ALGORITHM=COPY`.

As cláusulas `SEM VALIDAÇÃO` e `COM VALIDAÇÃO` afetam se a operação `ALTER TABLE` realiza uma operação in-place para modificações de colunas geradas virtualmente. Consulte Seção 13.1.8.2, “ALTER TABLE e Colunas Geradas”.

Anteriormente, o NDB Cluster suportava operações `ALTER TABLE` online usando as palavras-chave `ONLINE` e `OFFLINE`. Essas palavras-chave não são mais suportadas; seu uso causa um erro de sintaxe. O MySQL NDB Cluster 7.5 (e versões posteriores) suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. O `NDB` não suporta a alteração de um espaço de tabela online. Consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster” para obter mais informações.

A instrução `ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria tabelas temporárias ou arquivos de partição temporários.

A instrução `ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usadas com tabelas `NDB` (mysql-cluster.html)); no entanto, essas operações podem e criam arquivos de partição temporários.

As operações `ADD` ou `DROP` para partições `RANGE` ou `LIST` são operações imediatas ou quase imediatas. As operações `ADD` ou `COALESCE` para partições `HASH` ou `KEY` copiam dados entre todas as partições, a menos que tenha sido usado `HASH LINEAR` ou `KEY LINEAR`; isso é efetivamente o mesmo que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada partição por partição. As operações `REORGANIZE` copiam apenas as partições alteradas e não tocam nas que não foram alteradas.

Para tabelas `MyISAM`, você pode acelerar a recriação de índices (a parte mais lenta do processo de alteração) definindo a variável de sistema `myisam_sort_buffer_size` para um valor alto.

#### Controle de Concorrência

Para operações de `ALTER TABLE` que a suportam, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não padrão para essa cláusula permite que você exija um determinado nível de acesso ou exclusividade concorrente durante a operação de alteração e interrompa a operação se o grau de bloqueio solicitado não estiver disponível. Os parâmetros para a cláusula `LOCK` são:

- `LOCK = DEFAULT`

  Nível máximo de concorrência para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`: Permita leituras e escritas concorrentes se suportadas. Se não for o caso, permita leituras concorrentes se suportadas. Se não for o caso, imponha acesso exclusivo.

- `LOCK = NONE`

  Se estiver habilitado, permita leituras e escritas simultâneas. Caso contrário, ocorrerá um erro.

- `LOCK = SHARED`

  Se suportado, permita leituras concorrentes, mas bloqueie escritas. As escritas são bloqueadas mesmo que as escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`. Se as leituras concorrentes não forem suportadas, ocorrerá um erro.

- `LOCK = EXCLUSIVO`

  Forneça acesso exclusivo. Isso é feito mesmo que leituras/escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` especificada (se houver) e a operação `ALTER TABLE`.

#### Adicionar e Remover Colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão do MySQL para o SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma linha da tabela, use `FIRST` ou `AFTER col_name`. O padrão é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser excluída. Se o que você pretende é remover a tabela, use a instrução `DROP TABLE` em vez disso.

Se as colunas forem excluídas de uma tabela, elas também serão removidas de qualquer índice em que façam parte. Se todas as colunas que compõem um índice forem excluídas, o índice também será excluído.

#### Renomear, redefinir e reorganizar colunas

As cláusulas `CHANGE`, `MODIFY` e `ALTER` permitem alterar os nomes e definições das colunas existentes. Elas têm essas características comparativas:

- `ALTERAR`:

  - Pode renomear uma coluna e alterar sua definição, ou ambos.

  - Tem mais recursos do que `MODIFY`, mas a expensas da conveniência para algumas operações. `CHANGE` exige que você nomeie a coluna duas vezes, a menos que a renomeie.

  - Com `FIRST` ou `AFTER`, você pode reorganizar as colunas.

- `MODIFICAR`:

  - Pode alterar a definição de uma coluna, mas não seu nome.

  - Mais conveniente do que `CHANGE` para alterar a definição de uma coluna sem renomeá-la.

  - Com `FIRST` ou `AFTER`, você pode reorganizar as colunas.

- `ALTER`: Usado apenas para alterar o valor padrão de uma coluna.

`CHANGE` é uma extensão do MySQL para SQL padrão. `MODIFY` é uma extensão do MySQL para compatibilidade com Oracle.

Para alterar uma coluna para alterar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigos e novos e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT`, mantendo o atributo `NOT NULL`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar a definição de uma coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe exige dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para não alterar o nome. Por exemplo, para alterar a definição da coluna `b`, faça isso:

```sql
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` é mais conveniente para alterar a definição sem alterar o nome, pois requer o nome da coluna apenas uma vez:

```sql
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `CHANGE`. A sintaxe exige uma definição de coluna, então, para não alterar a definição, você deve especificar novamente a definição que a coluna tem atualmente. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça o seguinte:

```sql
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

Para alterações na definição de colunas usando `CHANGE` ou `MODIFY`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, exceto atributos de índice como `PRIMARY KEY` ou `UNIQUE`. Os atributos presentes na definição original, mas não especificados na nova definição, não são mantidos. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'minha coluna'` e você modifique a coluna da seguinte forma, com a intenção de alterar apenas `INT` para `BIGINT`:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa declaração altera o tipo de dado de `INT` para `BIGINT`, mas também exclui os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a declaração deve incluí-los explicitamente:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para alterações de tipo de dados usando `CHANGE` ou `MODIFY`, o MySQL tenta converter os valores existentes das colunas para o novo tipo da melhor maneira possível.

Aviso

Essa conversão pode resultar em alterações nos dados. Por exemplo, se você encurtar uma coluna de string, os valores podem ser truncados. Para evitar que a operação seja bem-sucedida se as conversões para o novo tipo de dado resultar em perda de dados, habilite o modo SQL rigoroso antes de usar `ALTER TABLE` (consulte Seção 5.1.10, “Modos SQL do Servidor”).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para colunas renomeadas por `CHANGE`, o MySQL renomeia automaticamente essas referências para a coluna renomeada:

- Índices que se referem à coluna antiga, incluindo índices e índices `MyISAM` desativados.

- Chaves estrangeiras que se referem à coluna antiga.

Para colunas renomeadas por `CHANGE`, o MySQL não renomeia automaticamente essas referências para a coluna renomeada:

- Expressões de coluna e partição geradas que se referem à coluna renomeada. Você deve usar `CHANGE` para redefinir essas expressões na mesma declaração `ALTER TABLE` que renomeia a coluna.

- Visões e programas armazenados que fazem referência à coluna renomeada. Você deve alterar manualmente a definição desses objetos para fazer referência ao novo nome da coluna.

Para reorganizar as colunas de uma tabela, use `FIRST` e `AFTER` nas operações `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especificam um novo valor padrão para uma coluna ou removem o valor padrão antigo, respectivamente. Se o valor padrão antigo for removido e a coluna puder ser `NULL`, o novo valor padrão será `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor padrão conforme descrito em Seção 11.6, “Valores padrão de tipo de dados”.

`ALTER ... SET DEFAULT` não pode ser usado com a função `CURRENT_TIMESTAMP`.

#### Chaves Primárias e Índices

`DROP PRIMARY KEY` exclui a chave primária. Se não houver uma chave primária, ocorrerá um erro. Para obter informações sobre as características de desempenho das chaves primárias, especialmente para tabelas `InnoDB`, consulte Seção 8.3.2, “Otimização da Chave Primária”.

Se você adicionar um `UNIQUE INDEX` ou `PRIMARY KEY` a uma tabela, o MySQL armazena-o antes de qualquer índice não exclusivo para permitir a detecção de chaves duplicadas o mais cedo possível.

`DROP INDEX` remove um índice. Esta é uma extensão do MySQL para o SQL padrão. Veja Seção 13.1.25, “Instrução DROP INDEX”. Para determinar os nomes dos índices, use `SHOW INDEX FROM tbl_name`.

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`. Para obter detalhes sobre `USING`, consulte Seção 13.1.14, “Instrução CREATE INDEX”. A posição preferida é após a lista de colunas. Você deve esperar que o suporte para a opção antes da lista de colunas seja removido em uma futura versão do MySQL.

Os valores de *`index_option`* especificam opções adicionais para um índice. Para obter detalhes sobre os valores de *`index_option`* permitidos, consulte Seção 13.1.14, “Instrução CREATE INDEX”.

`RENAME INDEX old_index_name TO new_index_name` renomeia um índice. Esta é uma extensão do MySQL para o SQL padrão. O conteúdo da tabela permanece inalterado. *`old_index_name`* deve ser o nome de um índice existente na tabela que não seja excluído pela mesma declaração `ALTER TABLE` (alter-table.html). *`new_index_name`* é o novo nome do índice, que não pode duplicar o nome de um índice na tabela resultante após as alterações terem sido aplicadas. Nenhum nome de índice pode ser `PRIMARY`.

Se você usar `ALTER TABLE` em uma tabela `MyISAM`, todos os índices não exclusivos são criados em um lote separado (como no caso de `REPAIR TABLE`). Isso deve tornar `ALTER TABLE` muito mais rápido quando você tiver muitos índices.

Para tabelas `MyISAM`, a atualização de chaves pode ser controlada explicitamente. Use `ALTER TABLE ... DISABLE KEYS` para dizer ao MySQL para parar de atualizar índices não únicos. Em seguida, use `ALTER TABLE ... ENABLE KEYS` para recriar índices ausentes. O `MyISAM` faz isso com um algoritmo especial que é muito mais rápido do que inserir chaves uma por uma, então desabilitar chaves antes de realizar operações de inserção em massa deve proporcionar um aumento considerável de velocidade. O uso de `ALTER TABLE ... DISABLE KEYS` requer o privilégio `INDEX`, além dos privilégios mencionados anteriormente.

Embora os índices não únicos estejam desativados, eles são ignorados para declarações como `SELECT` e `EXPLAIN` que, de outra forma, os usariam.

Após uma declaração de `ALTER TABLE`, pode ser necessário executar `ANALYZE TABLE` para atualizar as informações de cardinalidade do índice. Veja Seção 13.7.5.22, “Declaração SHOW INDEX”.

#### Chaves Estrangeiras e Outras Restrições

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos motores de armazenamento `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [símbolo]] FOREIGN KEY [nome_índice] (...) REFERENCES ... (...)`. Veja Seção 1.6.3.2, “Restrições FOREIGN KEY”. Para outros motores de armazenamento, as cláusulas são analisadas, mas ignoradas.

A cláusula de restrição `CHECK` é analisada, mas ignorada por todos os mecanismos de armazenamento. Veja Seção 13.1.18, “Instrução CREATE TABLE”. A razão para aceitar, mas ignorar, cláusulas de sintaxe é para compatibilidade, para facilitar a migração de código de outros servidores SQL e para executar aplicações que criam tabelas com referências. Veja Seção 1.6.2, “Diferenças do MySQL em relação ao SQL Padrão”.

Para `ALTER TABLE`, ao contrário de `CREATE TABLE`, `ADD FOREIGN KEY` ignora *`index_name`* se fornecido e usa um nome de chave estrangeira gerado automaticamente. Como solução alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da chave estrangeira:

```sql
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações `REFERENCES` em linha, onde as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas cláusulas `REFERENCES` definidas como parte de uma especificação `FOREIGN KEY` separada.

Nota

As tabelas `InnoDB` particionadas não suportam chaves estrangeiras. Essa restrição não se aplica às tabelas `NDB`, incluindo aquelas particionadas explicitamente por `[LINEAR] KEY`. Para mais informações, consulte Seção 22.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

O MySQL Server e o NDB Cluster suportam o uso de `ALTER TABLE` para excluir chaves estrangeiras:

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

A adição e a remoção de uma chave estrangeira na mesma instrução `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`, mas não para `ALTER TABLE ... ALGORITHM=COPY`.

O servidor proíbe alterações nas colunas de chave estrangeira que possam causar perda de integridade referencial. Uma solução é usar `ALTER TABLE ... DROP FOREIGN KEY` antes de alterar a definição da coluna e `ALTER TABLE ... ADD FOREIGN KEY` depois. Exemplos de alterações proibidas incluem:

- Alterações no tipo de dados de colunas de chave estrangeira que podem ser inseguras. Por exemplo, alterar `VARCHAR(20)` para `VARCHAR(30)` é permitido, mas alterá-lo para `VARCHAR(1024)` não é permitido porque isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

- Alterar uma coluna `NULL` para `NOT NULL` no modo não estrito é proibido para evitar a conversão de valores `NULL` em valores padrão `NOT NULL`, para os quais não existem valores correspondentes na tabela referenciada. A operação é permitida no modo estrito, mas um erro é retornado se tal conversão for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera os nomes internos das restrições de chave estrangeira e os nomes de restrições de chave estrangeira definidos pelo usuário que começam com a string “*`tbl_name`**ibfk*” para refletir o novo nome da tabela. O `InnoDB` interpreta os nomes de restrições de chave estrangeira que começam com a string “*`tbl_name`**ibfk*” como nomes gerados internamente.

#### Alterar o conjunto de caracteres

Para alterar o conjunto de caracteres padrão da tabela e todas as colunas de caracteres (`CHAR`, `VARCHAR`, `TEXT`) para um novo conjunto de caracteres, use uma instrução como esta:

```sql
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A declaração também altera a ordenação de todas as colunas de caracteres. Se você não especificar nenhuma cláusula `COLLATE` para indicar qual ordenação usar, a declaração usará a ordenação padrão para o conjunto de caracteres. Se essa ordenação for inadequada para o uso pretendido da tabela (por exemplo, se ela mudaria de uma ordenação sensível a maiúsculas para uma ordenação sensível a minúsculas), especifique explicitamente uma ordenação.

Para uma coluna com um tipo de dados de `VARCHAR` ou um dos tipos `TEXT`, `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna tenha o tamanho suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna `TEXT` tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna `latin1` `TEXT`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8`, cada caractere pode requerer até três bytes, para um comprimento máximo possível de 3 × 65.535 = 196.605 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna `TEXT`, então o MySQL converte o tipo de dados para `MEDIUMTEXT`, que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 196.605. Da mesma forma, uma coluna `VARCHAR` pode ser convertida para `MEDIUMTEXT`.

Para evitar alterações no tipo de dados do tipo descrito acima, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```sql
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas `CHAR`, `VARCHAR` e `TEXT` são convertidas para seus tipos de string binária correspondentes (`BINARY`, `VARBINARY`, `BLOB`). Isso significa que as colunas não têm mais um conjunto de caracteres e uma operação subsequente `CONVERT TO` não se aplica a elas.

Se `charset_name` for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema `character_set_database` é usado.

Aviso

A operação `CONVERT TO` converte os valores das colunas entre os conjuntos de caracteres originais e nomeados. Isso *não* é o que você deseja se tiver uma coluna em um conjunto de caracteres (como `latin1`), mas os valores armazenados realmente usam algum outro conjunto de caracteres incompatível (como `utf8`). Nesse caso, você deve fazer o seguinte para cada coluna desse tipo:

```sql
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou a partir das colunas `BLOB` (blob.html).

Para alterar apenas o conjunto de caracteres *padrão* de uma tabela, use esta instrução:

```sql
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres padrão é o conjunto de caracteres que é usado se você não especificar o conjunto de caracteres para as colunas que você adicionar a uma tabela mais tarde (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema `foreign_key_checks` está habilitada, que é a configuração padrão, a conversão de conjuntos de caracteres não é permitida em tabelas que incluem uma coluna de string de caracteres usada em uma restrição de chave estrangeira. A solução é desabilitar `foreign_key_checks` antes de realizar a conversão de conjuntos de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na restrição de chave estrangeira antes de reativar `foreign_key_checks`. Se você reativar `foreign_key_checks` após converter apenas uma das tabelas, uma operação `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper os dados na tabela de referência devido à conversão implícita que ocorre durante essas operações (Bug
\#45290, Bug #74816).

#### Descartando e importando espaços de tabela InnoDB

Uma tabela `InnoDB` criada em seu próprio espaço de tabelas file-per-table pode ser importada a partir de um backup ou de outra instância do servidor MySQL usando as cláusulas `DISCARD TABLEPACE` e `IMPORT TABLESPACE`. Veja Seção 14.6.1.3, “Importação de Tabelas InnoDB”.

#### Ordem de Linha para Tabelas MyISAM

A opção `ORDER BY` permite que você crie a nova tabela com as linhas em uma ordem específica. Esta opção é útil principalmente quando você sabe que consulta as linhas em uma ordem específica na maioria das vezes. Ao usar esta opção após alterações importantes na tabela, você pode obter um desempenho maior. Em alguns casos, isso pode facilitar o ordenamento no MySQL se a tabela estiver ordenada pela coluna pela qual você deseja ordená-la posteriormente.

Nota

A tabela não permanece na ordem especificada após inserções e exclusões.

A sintaxe `ORDER BY` permite que um ou mais nomes de colunas sejam especificados para a ordenação, cada um dos quais pode ser seguido opcionalmente por `ASC` ou `DESC` para indicar a ordem de classificação ascendente ou descendente, respectivamente. O padrão é a ordem ascendente. Apenas nomes de colunas são permitidos como critérios de classificação; expressões arbitrárias não são permitidas. Esta cláusula deve ser a última após qualquer outra cláusula.

A cláusula `ORDER BY` não faz sentido para tabelas do `InnoDB`, pois o `InnoDB` sempre ordena as linhas da tabela de acordo com o índice agrupado.

Quando usado em uma tabela particionada, `ALTER TABLE ... ORDER BY` ordena as linhas apenas dentro de cada particionamento.

#### Opções de Partição

*`partition_options`* indica opções que podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, mesclar e dividir partições, além de realizar a manutenção da partição.

É possível que uma instrução `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último, após qualquer outra especificação. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em uma única `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais.

Para obter mais informações sobre as opções de partição, consulte Seção 13.1.18, “Instrução CREATE TABLE” e Seção 13.1.8.1, “Operações de Partição ALTER TABLE”. Para obter informações e exemplos sobre as instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte Seção 22.3.3, “Troca de Partições e Subpartições com Tabelas”.

Antes do MySQL 5.7.6, as tabelas `InnoDB` particionadas usavam o manipulador de particionamento genérico `ha_partition` empregado pelo `MyISAM` e outros motores de armazenamento que não forneciam seus próprios manipuladores de particionamento; no MySQL 5.7.6 e versões posteriores, essas tabelas são criadas usando o próprio manipulador de particionamento (`InnoDB`) (ou "nativo") do motor de armazenamento. A partir do MySQL 5.7.9, você pode atualizar uma tabela `InnoDB` criada no MySQL 5.7.6 ou versões anteriores (ou seja, criada usando `ha_partition`) para o manipulador de particionamento nativo do `InnoDB` usando `ALTER TABLE ... UPGRADE PARTITIONING`. (Bug #76734, Bug #20727344) Essa sintaxe de `ALTER TABLE` não aceita outras opções e só pode ser usada em uma única tabela de cada vez. Você também pode usar **mysql\_upgrade** no MySQL 5.7.9 ou versões posteriores para atualizar tabelas **InnoDB** particionadas mais antigas para o manipulador de particionamento nativo.
