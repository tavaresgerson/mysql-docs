### 15.1.9 Declaração ALTER TABLE

15.1.9.1 Operações de Partição em Tabelas ALTER

15.1.9.2 ALTER TABLE e Colunas Geradas

15.1.9.3 Exemplos de ALTER TABLE

```
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
  | ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
  | DROP {CHECK | CONSTRAINT} symbol
  | ALTER {CHECK | CONSTRAINT} symbol [NOT] ENFORCED
  | ALGORITHM [=] {DEFAULT | INSTANT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | SET {VISIBLE | INVISIBLE}
      | DROP DEFAULT
    }
  | ALTER INDEX index_name {VISIBLE | INVISIBLE}
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
  | RENAME COLUMN old_col_name TO new_col_name
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
}

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
}

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
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
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

- Para usar `ALTER TABLE`, você precisa de privilégios `ALTER`, `CREATE` e `INSERT` para a tabela. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `ALTER`, `CREATE` e `INSERT` na nova tabela.

- Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for fornecida, `ALTER TABLE` não faz nada.

- A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da declaração `CREATE TABLE`. As cláusulas `column_definition` usam a mesma sintaxe para `ADD` e `CHANGE` que para `CREATE TABLE`. Para mais informações, consulte a Seção 15.1.20, “Declaração CREATE TABLE”.

- A palavra `COLUMN` é opcional e pode ser omitida, exceto para `RENAME COLUMN` (para distinguir uma operação de renomeação de coluna da operação de renomeação de tabela `RENAME`).

- Várias cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única declaração `ALTER TABLE`, separadas por vírgulas. Esta é uma extensão do MySQL para o SQL padrão, que permite apenas uma cláusula por declaração `ALTER TABLE`. Por exemplo, para descartar várias colunas em uma única declaração, faça o seguinte:

  ```
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

- Se um mecanismo de armazenamento não suportar uma operação `ALTER TABLE` tentativa, pode resultar em um aviso. Tais avisos podem ser exibidos com `SHOW WARNINGS`. Consulte a Seção 15.7.7.42, “Instrução SHOW WARNINGS”. Para informações sobre a solução de problemas com `ALTER TABLE`, consulte a Seção B.3.6.1, “Problemas com ALTER TABLE”.

- Para obter informações sobre colunas geradas, consulte a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

- Para exemplos de uso, consulte a Seção 15.1.9.3, “Exemplos de ALTER TABLE”.

- `InnoDB` no MySQL 8.0.17 e versões posteriores suporta a adição de índices de múltiplos valores em colunas JSON usando uma especificação `key_part` pode assumir a forma `(CAST json_path AS type ARRAY)`. Consulte Índices de Múltiplos Valores, para informações detalhadas sobre a criação de índices de múltiplos valores e o uso de, bem como restrições e limitações em índices de múltiplos valores.

- Com a função API `mysql_info()` C, você pode descobrir quantas linhas foram copiadas pelo `ALTER TABLE`. Veja mysql\_info().

Há vários aspectos adicionais da declaração `ALTER TABLE`, descritos nos tópicos a seguir nesta seção:

- Opções da tabela
- Requisitos de desempenho e espaço
- Controle de Concorrência
- Adicionar e Remover Colunas
- Renomear, redefinir e reorganizar colunas
- Chaves Primárias e Índices
- Chaves Estrangeiras e Outras Restrições
- Alterar o conjunto de caracteres
- Importar tabelas InnoDB
- Ordem de Linha para Tabelas MyISAM
- Opções de Partição

#### Opções da tabela

`table_options` indica opções de tabela do tipo que podem ser usadas na declaração `CREATE TABLE`, como `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT` ou `TABLESPACE`.

Para descrições de todas as opções de tabela, consulte a Seção 15.1.20, “Instrução CREATE TABLE”. No entanto, `ALTER TABLE` ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. `ALTER TABLE` permite que eles apenas como opções de particionamento e exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com `ALTER TABLE` oferece uma maneira conveniente de alterar características de uma única tabela. Por exemplo:

- Se `t1` atualmente não for uma tabela `InnoDB`, esta declaração altera seu mecanismo de armazenamento para `InnoDB`:

  ```
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  - Consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”, para obter considerações sobre a conversão de tabelas para o mecanismo de armazenamento `InnoDB`.

  - Quando você especifica uma cláusula `ENGINE`, o `ALTER TABLE` reconstrui a tabela. Isso é verdadeiro mesmo se a tabela já tiver o mecanismo de armazenamento especificado.

  - Executar `ALTER TABLE tbl_name ENGINE=INNODB` em uma tabela existente `InnoDB` realiza uma operação de `ALTER TABLE` “nulo”, que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito na Seção 17.11.4, “Desfragmentando uma Tabela”. Executar `ALTER TABLE tbl_name FORCE` em uma tabela `InnoDB` realiza a mesma função.

  - `ALTER TABLE tbl_name ENGINE=INNODB` e `ALTER TABLE tbl_name FORCE` utilizam DDL online. Para mais informações, consulte a Seção 17.12, “InnoDB e DDL Online”.

  - O resultado da tentativa de alterar o motor de armazenamento de uma tabela é afetado pela disponibilidade do motor de armazenamento desejado e pelo ajuste do modo SQL `NO_ENGINE_SUBSTITUTION`, conforme descrito na Seção 7.1.11, "Modos SQL do Servidor".

  - Para evitar a perda acidental de dados, `ALTER TABLE` não pode ser usado para alterar o mecanismo de armazenamento de uma tabela para `MERGE` ou `BLACKHOLE`.

- Para alterar a tabela `InnoDB` para usar o formato de armazenamento de linhas compactado:

  ```
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

- A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave de criptografia deve ser instalado e configurado para habilitar a criptografia.

  Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para usar uma cláusula `ENCRYPTION` com uma configuração diferente da configuração padrão de criptografia do esquema.

  Antes do MySQL 8.0.16, a cláusula `ENCRYPTION` só era suportada ao alterar tabelas que estavam em espaços de tabelas por arquivo. A partir do MySQL 8.0.16, a cláusula `ENCRYPTION` também é suportada para tabelas que estão em espaços de tabelas gerais.

  Para tabelas que residem em espaços de tabelas gerais, a criptografia da tabela e do espaço de tabela deve ser a mesma.

  Alterar a criptografia de uma tabela movendo-a para um espaço de tabelas diferente ou alterando o mecanismo de armazenamento não é permitido sem especificar explicitamente uma cláusula `ENCRYPTION`.

  A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se a tabela já estiver usando `InnoDB` (e você não alterar o motor de armazenamento da tabela), ou se a instrução `ALTER TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a instrução é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

  A partir do MySQL 8.0.16, não é permitido especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` se a tabela estiver usando um mecanismo de armazenamento que não suporte criptografia. Anteriormente, a cláusula era aceita. Tentar criar uma tabela sem uma cláusula `ENCRYPTION` em um esquema habilitado para criptografia usando um mecanismo de armazenamento que não suporte criptografia também não é permitido.

  Para obter mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

- Para redefinir o valor de incremento automático atual:

  ```
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

  Você não pode redefinir o contador para um valor menor ou igual ao valor que está atualmente em uso. Para os `InnoDB` e `MyISAM`, se o valor for menor ou igual ao valor máximo atualmente na coluna `AUTO_INCREMENT`, o valor é redefinido para o valor atual da coluna `AUTO_INCREMENT` mais um.

- Para alterar o conjunto de caracteres padrão da tabela:

  ```
  ALTER TABLE t1 CHARACTER SET = utf8mb4;
  ```

  Veja também Alterar o conjunto de caracteres.

- Para adicionar (ou alterar) um comentário de tabela:

  ```
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

- Use `ALTER TABLE` com a opção `TABLESPACE` para mover tabelas `InnoDB` entre espaços de tabelas gerais existentes, espaços de tabelas por arquivo e o espaço de tabelas do sistema. Veja Como mover tabelas entre espaços de tabelas usando ALTER TABLE.

  - As operações `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

  - A sintaxe `ALTER TABLE ... TABLESPACE` não suporta a movimentação de uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

  - A cláusula `DATA DIRECTORY`, que é suportada com `CREATE TABLE ... TABLESPACE`, não é suportada com `ALTER TABLE ... TABLESPACE` e é ignorada se especificada.

  - Para mais informações sobre as capacidades e limitações da opção `TABLESPACE`, consulte `CREATE TABLE`.

- O MySQL NDB Cluster 8.0 suporta a definição das opções `NDB_TABLE` para controlar o equilíbrio das partições de uma tabela (tipo de contagem de fragmentos), a capacidade de leitura a partir de qualquer replica, replicação completa ou qualquer combinação dessas opções, como parte do comentário da tabela para uma declaração `ALTER TABLE` da mesma maneira que para `CREATE TABLE`, conforme mostrado neste exemplo:

  ```
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  É também possível definir opções `NDB_COMMENT` para colunas de tabelas `NDB` como parte de uma instrução `ALTER TABLE`, como esta:

  ```
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=BLOB_INLINE_SIZE=4096,MAX_BLOB_PART_SIZE';
  ```

  A definição do tamanho do blob inline dessa forma é suportada pelo NDB 8.0.30 e versões posteriores. Tenha em mente que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte Configurando as opções NDB\_TABLE para obter informações e exemplos adicionais.

- As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de tabela, coluna e índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro. Os atributos de índice não podem ser alterados. Um índice deve ser excluído e adicionado novamente com a mudança desejada, o que pode ser feito em uma única instrução `ALTER TABLE`.

Para verificar se as opções da tabela foram alteradas conforme o esperado, use `SHOW CREATE TABLE` ou consulte a tabela do esquema de informações `TABLES`.

#### Requisitos de desempenho e espaço

As operações `ALTER TABLE` são processadas usando um dos seguintes algoritmos:

- `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova linha da tabela linha por linha. O DML concorrente não é permitido.

- `INPLACE`: As operações evitam a cópia dos dados da tabela, mas podem reconstruí-la no local. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante as fases de preparação e execução da operação. Normalmente, o DML concorrente é suportado.

- `INSTANT`: As operações apenas modificam os metadados no dicionário de dados. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante a fase de execução da operação. Os dados da tabela não são afetados, tornando as operações instantâneas. A DML concorrente é permitida. (Introduzido no MySQL 8.0.12)

Para tabelas que utilizam o mecanismo de armazenamento `NDB`, esses algoritmos funcionam da seguinte forma:

- `COPY`: `NDB` cria uma cópia da tabela e a altera; o manipulador do NDB Cluster então copia os dados entre as versões antigas e novas da tabela. Posteriormente, `NDB` exclui a tabela antiga e renomeia a nova.

  Isso é às vezes chamado de "cópia" ou "offline" `ALTER TABLE`.

- `INPLACE`: Os nós de dados fazem as alterações necessárias; o manipulador do NDB Cluster não copia dados ou participa de outra forma.

  Isso é às vezes chamado de "não cópia" ou "online" `ALTER TABLE`.

- `INSTANT`: Não é suportado por `NDB`.

Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INSTANT` para os motores de armazenamento e as cláusulas `ALTER TABLE` que a suportam. Caso contrário, é usado `ALGORITHM=INPLACE`. Se `ALGORITHM=INPLACE` não for suportada, é usada `ALGORITHM=COPY`.

Nota

Depois de adicionar uma coluna a uma tabela particionada usando `ALGORITHM=INSTANT`, não é mais possível realizar `ALTER TABLE ... EXCHANGE PARTITION` na tabela.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para cláusulas e motores de armazenamento que o suportem, ou falhará com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula `ALGORITHM`.

As operações `ALTER TABLE` que utilizam o algoritmo `COPY` aguardam por outras operações que estão modificando a tabela para serem concluídas. Após as alterações serem aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação `ALTER TABLE` é executada, a tabela original é legível por outras sessões (com a exceção mencionada brevemente). As atualizações e escritas na tabela iniciadas após o início da operação `ALTER TABLE` são interrompidas até que a nova tabela esteja pronta, e então são automaticamente redirecionadas para a nova tabela. A cópia temporária da tabela é criada no diretório do banco de dados da tabela original, a menos que seja uma operação `RENAME TO` que mova a tabela para um banco de dados que reside em um diretório diferente.

A exceção mencionada anteriormente é que os blocos `ALTER TABLE` de leitura (não apenas de escrita) são realizados no ponto em que ele está pronto para limpar estruturas de tabelas desatualizadas das caches de definição de tabela. Neste ponto, ele deve adquirir um bloqueio exclusivo. Para isso, ele aguarda que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` impede operações DML concorrentes. As consultas concorrentes ainda são permitidas. Ou seja, uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permitir consultas, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK` especificando `LOCK=EXCLUSIVE`, que impede DML e consultas. Para mais informações, consulte Controle de Concorrência.

Para forçar o uso do algoritmo `COPY` para uma operação `ALTER TABLE` que, de outra forma, não o usaria, especifique `ALGORITHM=COPY` ou habilite a variável de sistema `old_alter_table`. Se houver um conflito entre a configuração `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` terá precedência.

Para as tabelas `InnoDB`, uma operação `ALTER TABLE` que usa o algoritmo `COPY` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações exigem tanto espaço adicional quanto os dados na tabela mais os índices. Para uma tabela que reside em um espaço de tabelas compartilhado, o espaço adicional usado durante a operação não é liberado de volta ao sistema operacional, como acontece com uma tabela que reside em um espaço de tabelas por arquivo.

Para obter informações sobre os requisitos de espaço para operações DDL online, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”.

As operações `ALTER TABLE` que suportam o algoritmo `INPLACE` incluem:

- Operações `ALTER TABLE` suportadas pelo recurso DDL online `InnoDB`. Consulte a Seção 17.12.1, “Operações DDL Online”.

- Renomear uma tabela. O MySQL renomeia os arquivos que correspondem à tabela `tbl_name` sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Veja a Seção 15.1.36, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

- Operações que modificam apenas os metadados da tabela. Essas operações são imediatas porque o servidor não altera o conteúdo da tabela. As operações que modificam apenas os metadados incluem:

  - Renomear uma coluna. No NDB Cluster 8.0.18 e versões posteriores, essa operação também pode ser realizada online.

  - Alterar o valor padrão de uma coluna (exceto para tabelas `NDB`).

  - Modificar a definição de uma coluna `ENUM` ou `SET` adicionando novos membros da enumeração ou conjunto ao *final* da lista de valores de membro válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a reenumeração dos membros existentes, o que requer uma cópia da tabela.

  - Alterar a definição de uma coluna espacial para remover o atributo `SRID`. (Adicionar ou alterar um atributo `SRID` requer uma reconstrução e não pode ser feito in loco, porque o servidor deve verificar se todos os valores têm o valor especificado `SRID`.)

  - A partir do MySQL 8.0.14, alterar o conjunto de caracteres de uma coluna, quando essas condições forem aplicadas:

    - O tipo de dado da coluna é `CHAR`, `VARCHAR`, um tipo `TEXT` ou `ENUM`.

    - A mudança no conjunto de caracteres é de `utf8mb3` para `utf8mb4`, ou qualquer conjunto de caracteres para `binary`.

    - Não há índice na coluna.

  - A partir do MySQL 8.0.14, alterar uma coluna gerada, quando essas condições forem aplicadas:

    - Para as tabelas `InnoDB`, as declarações que modificam colunas armazenadas geradas, mas não alteram seu tipo, expressão ou nulidade.

    - Para tabelas que não são `InnoDB`s, as instruções que modificam colunas armazenadas ou virtuais geradas, mas não alteram seu tipo, expressão ou nulidade.

    Um exemplo dessa mudança é a alteração no comentário da coluna.

- Renomear um índice.

- Adicionar ou excluir um índice secundário para as tabelas `InnoDB` e `NDB`. Consulte a Seção 17.12.1, “Operações DDL online”.

- Para as tabelas `NDB`, operações que adicionam e excluem índices em colunas de largura variável. Essas operações ocorrem online, sem cópia da tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Veja a Seção 25.6.12, “Operações Online com ALTER TABLE no NDB Cluster”.

- Modificando a visibilidade do índice com uma operação `ALTER INDEX`.

- As modificações de colunas em tabelas que contêm colunas geradas que dependem de colunas com o valor `DEFAULT` se as colunas modificadas não estiverem envolvidas nas expressões de colunas geradas. Por exemplo, alterar a propriedade `NULL` de uma coluna separada pode ser feito in loco sem a necessidade de reconstrução da tabela.

As operações `ALTER TABLE` que suportam o algoritmo `INSTANT` incluem:

- Adicionar uma coluna. Esse recurso é denominado “Instant `ADD COLUMN`”. Aplicam-se limitações. Consulte a Seção 17.12.1, “Operações DDL online”.

- Excluir uma coluna. Esse recurso é chamado de “Instant \[\[`DROP COLUMN`] ]”. Aplicam-se limitações. Consulte a Seção 17.12.1, “Operações DDL Online”.

- Adicionar ou remover uma coluna virtual.

- Adicionar ou remover um valor padrão de coluna.

- Modificando a definição de uma coluna `ENUM` ou `SET`. As mesmas restrições se aplicam conforme descrito acima para `ALGORITHM=INSTANT`.

- Alterando o tipo de índice.

- Renomear uma tabela. As mesmas restrições se aplicam conforme descrito acima para `ALGORITHM=INSTANT`.

Para obter mais informações sobre operações que suportam `ALGORITHM=INSTANT`, consulte a Seção 17.12.1, “Operações DDL Online”.

`ALTER TABLE` atualiza as colunas temporais do MySQL 5.5 para o formato 5.6 para as operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser feita usando o algoritmo `INPLACE`, porque a tabela deve ser reconstruída, então especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um índice de múltiplos campos usada para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só pode ser realizada usando `ALGORITHM=COPY`.

As cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION` afetam se o `ALTER TABLE` realiza uma operação in-place para modificações de coluna geradas virtualmente. Veja a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

O NDB Cluster 8.0 suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. `NDB` não suporta a alteração de um espaço de tabela online; a partir do NDB 8.0.21, isso é desativado. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

No NDB 8.0.27 e versões posteriores, ao executar uma cópia `ALTER TABLE`, o sistema verifica se nenhuma escrita concorrente foi realizada na tabela afetada. Se for encontrado que alguma foi realizada, o `NDB` rejeita a instrução `ALTER TABLE` e gera o `ER_TABLE_DEF_CHANGED`.

`ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria tabelas temporárias ou arquivos de partição temporários.

`ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usado com tabelas `NDB`). No entanto, essas operações podem e criam arquivos de partição temporários.

As operações `ADD` ou `DROP` para as partições `RANGE` ou `LIST` são operações imediatas ou quase imediatas. As operações `ADD` ou `COALESCE` para as partições `HASH` ou `KEY` copiam dados entre todas as partições, a menos que `LINEAR HASH` ou `LINEAR KEY` tenha sido usado; isso é efetivamente a mesma coisa que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada por partição. As operações `REORGANIZE` copiam apenas as partições alteradas e não tocam nas não alteradas.

Para as tabelas `MyISAM`, você pode acelerar a recriação do índice (a parte mais lenta do processo de alteração) definindo a variável de sistema `myisam_sort_buffer_size` para um valor alto.

#### Controle de Concorrência

Para operações `ALTER TABLE` que a suportam, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não padrão para essa cláusula permite que você exija um determinado nível de acesso ou exclusividade concorrente durante a operação de alteração e interrompa a operação se o grau de bloqueio solicitado não estiver disponível.

Apenas o `LOCK = DEFAULT` é permitido para operações que utilizam `ALGORITHM=INSTANT`. Os outros parâmetros da cláusula `LOCK` não são aplicáveis.

Os parâmetros para a cláusula `LOCK` são:

- `LOCK = DEFAULT`

  Nível máximo de concorrência para a cláusula `ALGORITHM` (se houver) e operação `ALTER TABLE`: Permitir leituras e escritas concorrentes se suportadas. Se não, permitir leituras concorrentes se suportadas. Se não, impor acesso exclusivo.

- `LOCK = NONE`

  Se estiver habilitado, permita leituras e escritas simultâneas. Caso contrário, ocorrerá um erro.

- `LOCK = SHARED`

  Se suportado, permita leituras concorrentes, mas bloqueie escritas. As escritas são bloqueadas mesmo que as escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`. Se as leituras concorrentes não forem suportadas, ocorrerá um erro.

- `LOCK = EXCLUSIVE`

  Forneça acesso exclusivo. Isso é feito mesmo que leituras/escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` (se houver) e a operação `ALTER TABLE`.

#### Adicionar e Remover Colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão do MySQL para o SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma linha da tabela, use `FIRST` ou `AFTER col_name`. O padrão é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser excluída. Se o que você pretende é remover a tabela, use a instrução `DROP TABLE` em vez disso.

Se as colunas forem excluídas de uma tabela, elas também serão removidas de qualquer índice em que façam parte. Se todas as colunas que compõem um índice forem excluídas, o índice também será excluído. Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para `ALTER TABLE ... ADD`, se a coluna tiver um valor padrão de expressão que utiliza uma função não determinística, a instrução pode gerar uma mensagem de aviso ou erro. Para obter mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados”, e a Seção 19.1.3.7, “Restrições de replicação com GTIDs”.

#### Renomear, redefinir e reorganizar colunas

As cláusulas `CHANGE`, `MODIFY`, `RENAME COLUMN` e `ALTER` permitem que os nomes e definições das colunas existentes sejam alterados. Elas têm essas características comparativas:

- `CHANGE`:

  - Pode renomear uma coluna e alterar sua definição, ou ambos.

  - Tem mais recursos do que `MODIFY` ou `RENAME COLUMN`, mas a expensas da conveniência para algumas operações. `CHANGE` exige que você nomeie a coluna duas vezes, se não renomeá-la, e exige que você redefina a definição da coluna se apenas renomeá-la.

  - Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

- `MODIFY`:

  - Pode alterar a definição de uma coluna, mas não seu nome.

  - Mais conveniente do que `CHANGE` para alterar a definição de uma coluna sem renomeá-la.

  - Com `FIRST` ou `AFTER`, pode reorganizar as colunas.

- `RENAME COLUMN`:

  - Pode alterar o nome de uma coluna, mas não sua definição.
  - Mais conveniente do que `CHANGE` para renomear uma coluna sem alterar sua definição.

- `ALTER`: Usado apenas para alterar o valor padrão de uma coluna.

`CHANGE` é uma extensão do MySQL para o SQL padrão. `MODIFY` e `RENAME COLUMN` são extensões do MySQL para compatibilidade com o Oracle.

Para alterar uma coluna para alterar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigos e novos e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT`, mantendo o atributo `NOT NULL`, faça o seguinte:

```
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar a definição de uma coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe exige dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para não alterar o nome. Por exemplo, para alterar a definição da coluna `b`, faça o seguinte:

```
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

É mais conveniente alterar a definição sem alterar o nome, pois é necessário usar o nome da coluna apenas uma vez: `MODIFY`

```
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `CHANGE` ou `RENAME COLUMN`. Com `CHANGE`, a sintaxe exige uma definição de coluna, então, para não alterar a definição, você deve redefinir a definição atual da coluna. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça o seguinte:

```
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

É mais conveniente alterar o nome sem alterar a definição usando `RENAME COLUMN`, pois é necessário apenas os nomes antigo e novo:

```
ALTER TABLE t1 RENAME COLUMN b TO a;
```

De modo geral, você não pode renomear uma coluna para um nome que já exista na tabela. No entanto, isso nem sempre é o caso, como quando você troca os nomes ou os move através de um ciclo. Se uma tabela tiver colunas com os nomes `a`, `b` e `c`, essas são operações válidas:

```
-- swap a and b
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO a;
-- "rotate" a, b, c through a cycle
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO c,
               RENAME COLUMN c TO a;
```

Para alterações na definição de coluna usando `CHANGE` ou `MODIFY`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, exceto atributos de índice como `PRIMARY KEY` ou `UNIQUE`. Os atributos presentes na definição original, mas não especificados para a nova definição, não são mantidos. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` e você modifique a coluna da seguinte forma, com a intenção de alterar apenas `INT` para `BIGINT`:

```
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa declaração altera o tipo de dado de `INT` para `BIGINT`, mas também exclui os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a declaração deve incluí-los explicitamente:

```
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para alterações de tipo de dados usando `CHANGE` ou `MODIFY`, o MySQL tenta converter os valores existentes das colunas para o novo tipo da melhor maneira possível.

Aviso

Essa conversão pode resultar em alterações nos dados. Por exemplo, se você encurtar uma coluna de string, os valores podem ser truncados. Para evitar que a operação seja bem-sucedida se as conversões para o novo tipo de dado resultar em perda de dados, habilite o modo SQL rigoroso antes de usar `ALTER TABLE` (consulte a Seção 7.1.11, “Modos SQL do servidor”).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL renomeia automaticamente essas referências para a coluna renomeada:

- Índices que se referem à coluna antiga, incluindo índices invisíveis e índices desativados `MyISAM`.

- Chaves estrangeiras que se referem à coluna antiga.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL não renomeia automaticamente essas referências para a coluna renomeada:

- Expressões de coluna e partição geradas que se referem à coluna renomeada. Você deve usar `CHANGE` para redefinir tais expressões na mesma declaração `ALTER TABLE` que renomeia a coluna.

- Visões e programas armazenados que fazem referência à coluna renomeada. Você deve alterar manualmente a definição desses objetos para fazer referência ao novo nome da coluna.

Para reorganizar as colunas dentro de uma tabela, use `FIRST` e `AFTER` nas operações `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especifica um novo valor padrão para uma coluna ou remove o valor padrão antigo, respectivamente. Se o valor padrão antigo for removido e a coluna puder ser `NULL`, o novo valor padrão é `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor padrão conforme descrito na Seção 13.6, “Valores padrão de tipo de dados”.

A partir do MySQL 8.0.23, `ALTER ... SET VISIBLE` e `ALTER ... SET INVISIBLE` permitem alterar a visibilidade das colunas. Veja a Seção 15.1.20.10, “Colunas invisíveis”.

#### Chaves Primárias e Índices

`DROP PRIMARY KEY` exclui a chave primária. Se não houver chave primária, ocorrerá um erro. Para obter informações sobre as características de desempenho das chaves primárias, especialmente para as tabelas `InnoDB`, consulte a Seção 10.3.2, “Otimização da Chave Primária”.

Se a variável de sistema `sql_require_primary_key` estiver habilitada, a tentativa de excluir uma chave primária produzirá um erro.

Se você adicionar um `UNIQUE INDEX` ou `PRIMARY KEY` a uma tabela, o MySQL armazena-o antes de qualquer índice não exclusivo para permitir a detecção de chaves duplicadas o mais cedo possível.

`DROP INDEX` remove um índice. Esta é uma extensão do MySQL para o SQL padrão. Veja a Seção 15.1.27, “Instrução DROP INDEX”. Para determinar os nomes dos índices, use `SHOW INDEX FROM tbl_name`.

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador `index_type` é `USING type_name`. Para detalhes sobre `USING`, consulte a Seção 15.1.15, “Instrução CREATE INDEX”. A posição preferida é após a lista de colunas. Espera-se que o suporte para o uso da opção antes da lista de colunas seja removido em uma futura versão do MySQL.

Os valores de `index_option` especificam opções adicionais para um índice. `USING` é uma dessas opções. Para obter detalhes sobre os valores de `index_option` permitidos, consulte a Seção 15.1.15, “Instrução CREATE INDEX”.

`RENAME INDEX old_index_name TO new_index_name` renomeia um índice. Esta é uma extensão do MySQL para o SQL padrão. O conteúdo da tabela permanece inalterado. `old_index_name` deve ser o nome de um índice existente na tabela que não seja excluído pela mesma declaração `ALTER TABLE`. `new_index_name` é o novo nome do índice, que não pode duplicar o nome de um índice na tabela resultante após as alterações terem sido aplicadas. Nenhum dos nomes de índice pode ser `PRIMARY`.

Se você usar `ALTER TABLE` em uma tabela `MyISAM`, todos os índices não exclusivos são criados em um lote separado (como no caso de `REPAIR TABLE`). Isso deve tornar `ALTER TABLE` muito mais rápido quando você tiver muitos índices.

Para as tabelas `MyISAM`, a atualização de chaves pode ser controlada explicitamente. Use `ALTER TABLE ... DISABLE KEYS` para dizer ao MySQL para parar de atualizar índices não únicos. Em seguida, use `ALTER TABLE ... ENABLE KEYS` para recriar índices ausentes. `MyISAM` faz isso com um algoritmo especial que é muito mais rápido do que inserir chaves uma por uma, então desabilitar chaves antes de realizar operações de inserção em massa deve dar um aumento considerável de velocidade. Usar `ALTER TABLE ... DISABLE KEYS` requer o privilégio `INDEX`, além dos privilégios mencionados anteriormente.

Embora os índices não únicos estejam desativados, eles são ignorados para declarações como `SELECT` e `EXPLAIN`, que, de outra forma, os usariam.

Após uma declaração `ALTER TABLE`, pode ser necessário executar `ANALYZE TABLE` para atualizar as informações de cardinalidade do índice. Veja a Seção 15.7.7.22, “Declaração SHOW INDEX”.

A operação `ALTER INDEX` permite que um índice seja tornado visível ou invisível. Um índice invisível não é utilizado pelo otimizador. A modificação da visibilidade do índice aplica-se a índices que não sejam chaves primárias (explícitos ou implícitos) e não pode ser realizada usando `ALGORITHM=INSTANT`. Este recurso é neutro em relação ao mecanismo de armazenamento (suportável para qualquer mecanismo). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

#### Chaves Estrangeiras e Outras Restrições

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos motores de armazenamento `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. Veja a Seção 15.1.20.5, “Restrições de Chave Estrangeira”. Para outros motores de armazenamento, as cláusulas são analisadas, mas ignoradas.

Para `ALTER TABLE`, ao contrário de `CREATE TABLE`, `ADD FOREIGN KEY` ignora `index_name` se fornecido e usa um nome de chave estrangeira gerado automaticamente. Como solução alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da chave estrangeira:

```
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações em linha `REFERENCES` quando as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas as cláusulas `REFERENCES` definidas como parte de uma especificação `FOREIGN KEY` separada.

Nota

As tabelas `InnoDB` particionadas não suportam chaves estrangeiras. Essa restrição não se aplica às tabelas `NDB`, incluindo aquelas particionadas explicitamente por `[LINEAR] KEY`. Para obter mais informações, consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

O MySQL Server e o NDB Cluster suportam o uso de `ALTER TABLE` para descartar chaves estrangeiras:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

A adição e a remoção de uma chave estrangeira na mesma declaração `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`, mas não para `ALTER TABLE ... ALGORITHM=COPY`.

O servidor proíbe alterações nas colunas de chave estrangeira que possam causar perda de integridade referencial. Uma solução é usar `ALTER TABLE ... DROP FOREIGN KEY` antes de alterar a definição da coluna e `ALTER TABLE ... ADD FOREIGN KEY` depois. Exemplos de alterações proibidas incluem:

- Alterações no tipo de dados das colunas de chave estrangeira que podem ser inseguras. Por exemplo, alterar `VARCHAR(20)` para `VARCHAR(30)` é permitido, mas alterar para `VARCHAR(1024)` não é, pois isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

- Alterar uma coluna `NULL` para `NOT NULL` no modo não estrito é proibido para evitar a conversão de valores `NULL` para valores padrão não `NULL`, para os quais não existem valores correspondentes na tabela referenciada. A operação é permitida no modo estrito, mas um erro é retornado se qualquer conversão desse tipo for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera os nomes das restrições de chave estrangeira geradas internamente e os nomes das restrições de chave estrangeira definidas pelo usuário que começam com a string “\*`tbl_name`**ibfk*” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes das restrições de chave estrangeira que começam com a string “*`tbl_name`\**ibfk*” como nomes gerados internamente.

Antes do MySQL 8.0.16, `ALTER TABLE` permite apenas a seguinte versão limitada da sintaxe de adição de restrições `CHECK`, que é analisada e ignorada:

```
ADD CHECK (expr)
```

A partir do MySQL 8.0.16, o `ALTER TABLE` permite que as restrições `CHECK` sejam adicionadas, excluídas ou alteradas em tabelas existentes:

- Adicione uma nova restrição `CHECK`:

  ```
  ALTER TABLE tbl_name
      ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED];
  ```

  O significado dos elementos de sintaxe de restrição é o mesmo que para `CREATE TABLE`. Consulte a Seção 15.1.20.6, “Restrições CHECK”.

- Remova a restrição existente `CHECK` com o nome `symbol`:

  ```
  ALTER TABLE tbl_name
      DROP CHECK symbol;
  ```

- Alterar se a restrição existente `CHECK` com o nome `symbol` é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CHECK symbol [NOT] ENFORCED;
  ```

As cláusulas `DROP CHECK` e `ALTER CHECK` são extensões do MySQL para o SQL padrão.

A partir do MySQL 8.0.19, `ALTER TABLE` permite uma sintaxe mais geral (e padrão do SQL) para a remoção e alteração de restrições existentes de qualquer tipo, onde o tipo da restrição é determinado a partir do nome da restrição:

- Desça uma restrição existente nomeada `symbol`:

  ```
  ALTER TABLE tbl_name
      DROP CONSTRAINT symbol;
  ```

  Se a variável de sistema `sql_require_primary_key` estiver habilitada, a tentativa de excluir uma chave primária produzirá um erro.

- Alterar se uma restrição existente chamada `symbol` é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CONSTRAINT symbol [NOT] ENFORCED;
  ```

  Apenas as restrições `CHECK` podem ser alteradas para não serem aplicadas. Todos os outros tipos de restrição são sempre aplicados.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas as restrições de diferentes tipos podem ter o mesmo nome. Quando várias restrições têm o mesmo nome, `DROP CONSTRAINT` e `ADD CONSTRAINT` são ambíguos e ocorre um erro. Nesses casos, a sintaxe específica da restrição deve ser usada para modificar a restrição. Por exemplo, use `DROP PRIMARY KEY` ou DROP FOREIGN KEY para descartar uma chave primária ou chave estrangeira.

Se uma alteração na tabela causar uma violação de uma restrição `CHECK` aplicada, um erro ocorre e a tabela não é modificada. Exemplos de operações para as quais ocorre um erro:

- Tentativas de adicionar o atributo `AUTO_INCREMENT` a uma coluna que é usada em uma restrição `CHECK`.

- Tentativas de adicionar uma restrição `CHECK` aplicada ou aplicar uma restrição `CHECK` não aplicada para a qual as linhas existentes violam a condição da restrição.

- Tente modificar, renomear ou excluir uma coluna que é usada em uma restrição `CHECK`, a menos que essa restrição também seja excluída na mesma instrução. Exceção: Se uma restrição `CHECK` se refere apenas a uma única coluna, a exclusão da coluna exclui automaticamente a restrição.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera os nomes de restrições gerados internamente e definidos pelo usuário `CHECK` que começam com a string “\*`tbl_name`**chk*” para refletir o novo nome da tabela. O MySQL interpreta os nomes de restrições `CHECK` que começam com a string “*`tbl_name`\**chk*” como nomes gerados internamente.

#### Alterar o conjunto de caracteres

Para alterar o conjunto de caracteres padrão da tabela e todas as colunas de caracteres (`CHAR`, `VARCHAR`, `TEXT`) para um novo conjunto de caracteres, use uma instrução como esta:

```
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A declaração também altera a ordenação de todas as colunas de caracteres. Se você não especificar nenhuma cláusula `COLLATE` para indicar qual ordenação usar, a declaração usará a ordenação padrão para o conjunto de caracteres. Se essa ordenação for inadequada para o uso pretendido da tabela (por exemplo, se ela mudaria de uma ordenação sensível a maiúsculas para uma ordenação sensível a minúsculas), especifique explicitamente uma ordenação.

Para uma coluna com um tipo de dados de `VARCHAR` ou um dos tipos `TEXT`, `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna tenha o comprimento suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna `TEXT` tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna `latin1` `TEXT`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8mb4`, cada caractere pode requerer até 4 bytes, para um comprimento máximo possível de 4 × 65.535 = 262.140 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna `TEXT`, então o MySQL converte o tipo de dados para `MEDIUMTEXT`, que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 262.140. Da mesma forma, uma coluna `VARCHAR` pode ser convertida para `MEDIUMTEXT`.

Para evitar alterações no tipo de dados do tipo descrito acima, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8mb4;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8mb4;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas `CHAR`, `VARCHAR` e `TEXT` são convertidas para seus tipos de string binária correspondentes (`BINARY`, `VARBINARY`, `BLOB`). Isso significa que as colunas não têm mais um conjunto de caracteres e uma operação subsequente `CONVERT TO` não se aplica a elas.

Se `charset_name` for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema `character_set_database` é usado.

Aviso

A operação `CONVERT TO` converte os valores das colunas entre os conjuntos de caracteres originais e nomeados. Isso *não* é o que você deseja se tiver uma coluna em um conjunto de caracteres (como `latin1`) mas os valores armazenados usam, na verdade, outro conjunto de caracteres incompatível (como `utf8mb4`). Nesse caso, você deve fazer o seguinte para cada coluna desse tipo:

```
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8mb4;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou a partir das colunas `BLOB`.

Para alterar apenas o conjunto de caracteres *padrão* de uma tabela, use esta instrução:

```
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres padrão é o conjunto de caracteres que é usado se você não especificar o conjunto de caracteres para as colunas que você adicionar a uma tabela mais tarde (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema `foreign_key_checks` estiver habilitada, que é a configuração padrão, a conversão de conjuntos de caracteres não é permitida em tabelas que incluem uma coluna de string de caracteres usada em uma restrição de chave estrangeira. A solução é desabilitar `foreign_key_checks` antes de realizar a conversão de conjuntos de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na restrição de chave estrangeira antes de reativar `foreign_key_checks`. Se você reativar `foreign_key_checks` após converter apenas uma das tabelas, uma operação `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper os dados na tabela de referência devido à conversão implícita que ocorre durante essas operações (Bug
\#45290, Bug #74816).

#### Importar tabelas InnoDB

Uma tabela `InnoDB` criada em seu próprio espaço de tabelas por arquivo pode ser importada a partir de um backup ou de outra instância do servidor MySQL usando as cláusulas `DISCARD TABLEPACE` e `IMPORT TABLESPACE`. Veja a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

#### Ordem de Linha para Tabelas MyISAM

`ORDER BY` permite que você crie a nova tabela com as linhas em uma ordem específica. Esta opção é útil principalmente quando você sabe que consulta as linhas em uma ordem específica a maior parte do tempo. Ao usar esta opção após alterações importantes na tabela, você pode obter um desempenho maior. Em alguns casos, isso pode facilitar o ordenamento do MySQL se a tabela estiver em ordem pela coluna pela qual você deseja ordená-la mais tarde.

Nota

A tabela não permanece na ordem especificada após inserções e exclusões.

A sintaxe `ORDER BY` permite que um ou mais nomes de coluna sejam especificados para a ordenação, sendo que cada um deles pode ser seguido opcionalmente por `ASC` ou `DESC` para indicar a ordem de classificação ascendente ou descendente, respectivamente. O padrão é a ordem ascendente. Apenas nomes de coluna são permitidos como critérios de ordenação; expressões arbitrárias não são permitidas. Esta cláusula deve ser a última a ser dada após qualquer outra cláusula.

`ORDER BY` não faz sentido para tabelas de `InnoDB` porque `InnoDB` sempre ordena as linhas da tabela de acordo com o índice agrupado.

Quando usado em uma tabela particionada, `ALTER TABLE ... ORDER BY` ordena apenas as linhas dentro de cada partição.

#### Opções de Partição

`partition_options` indica opções que podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, unir e dividir partições, além de realizar a manutenção de particionamento.

É possível que uma declaração `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` em uma adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último após quaisquer outras especificações. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em uma única `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais.

Para obter mais informações sobre as opções de partição, consulte a Seção 15.1.20, “Instrução CREATE TABLE”, e a Seção 15.1.9.1, “Operações de Partição ALTER TABLE”. Para obter informações e exemplos sobre as instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte a Seção 26.3.3, “Troca de Partições e Subpartições com Tabelas”.
