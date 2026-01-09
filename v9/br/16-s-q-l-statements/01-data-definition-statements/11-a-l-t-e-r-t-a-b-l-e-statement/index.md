### 15.1.11 Declaração `ALTER TABLE`

15.1.11.1 Operações de Partição `ALTER TABLE`

15.1.11.2 `ALTER TABLE` e Colunas Geradas

15.1.11.3 Exemplos de `ALTER TABLE`

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

A declaração `ALTER TABLE` altera a estrutura de uma tabela. Por exemplo, você pode adicionar ou excluir colunas, criar ou destruir índices, alterar o tipo de colunas existentes ou renomear colunas ou a própria tabela. Você também pode alterar características como o mecanismo de armazenamento usado para a tabela ou o comentário da tabela.

* Para usar `ALTER TABLE`, você precisa de privilégios `ALTER`, `CREATE` e `INSERT` para a tabela. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `ALTER`, `CREATE` e `INSERT` na nova tabela.

* Após o nome da tabela, especifique as alterações a serem feitas. Se nenhuma for dada, `ALTER TABLE` não faz nada.

* A sintaxe para muitas das alterações permitidas é semelhante às cláusulas da declaração `CREATE TABLE`. As cláusulas `column_definition` usam a mesma sintaxe para `ADD` e `CHANGE` quanto para `CREATE TABLE`. Para mais informações, consulte a Seção 15.1.24, “Declaração `CREATE TABLE`”.

* A palavra `COLUMN` é opcional e pode ser omitida, exceto para `RENAME COLUMN` (para distinguir uma operação de renomeação de coluna da operação de renomeação de tabela `RENAME`).

* Múltiplas cláusulas `ADD`, `ALTER`, `DROP` e `CHANGE` são permitidas em uma única declaração `ALTER TABLE`, separadas por vírgulas. Essa é uma extensão do MySQL ao SQL padrão, que permite apenas uma de cada cláusula por declaração `ALTER TABLE`. Por exemplo, para excluir múltiplas colunas em uma única declaração, faça isso:

  ```
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* Se um mecanismo de armazenamento não suportar uma operação de `ALTER TABLE` tentada, pode ser exibido um aviso. Esses avisos podem ser exibidos com `SHOW WARNINGS`. Consulte a Seção 15.7.7.43, “Instrução SHOW WARNINGS”. Para informações sobre a solução de problemas com `ALTER TABLE`, consulte a Seção B.3.6.1, “Problemas com ALTER TABLE”.

* Para informações sobre colunas geradas, consulte a Seção 15.1.11.2, “ALTER TABLE e Colunas Geradas”.

* Para exemplos de uso, consulte a Seção 15.1.11.3, “Exemplos de ALTER TABLE”.

* O `InnoDB` suporta a adição de índices de múltiplos valores em colunas JSON usando uma especificação de *`key_part`* que pode ter a forma `(CAST json_path AS type ARRAY)`. Consulte Índices de Múltiplos Valores, para informações detalhadas sobre a criação e o uso de índices de múltiplos valores, bem como restrições e limitações em índices de múltiplos valores.

* Com a função C API `mysql_info()`, você pode descobrir quantos registros foram copiados por `ALTER TABLE`. Consulte mysql_info().

Há vários aspectos adicionais da instrução `ALTER TABLE`, descritos nos seguintes tópicos nesta seção:

* Opções da Tabela
* Requisitos de Desempenho e Espaço
* Controle de Concorrência
* Adicionar e Remover Colunas
* Renomear, Redefinir e Rearranjar Colunas
* Chaves Primárias e Índices
* Chaves Estrangeiras e Outras Restrições
* Alterar o Conjunto de Caracteres
* Importar Tabelas InnoDB
* Ordem de Registro para Tabelas MyISAM
* Opções de Partição

Para descrições de todas as opções de tabela, consulte a Seção 15.1.24, “Instrução CREATE TABLE”. No entanto, `ALTER TABLE` ignora `DATA DIRECTORY` e `INDEX DIRECTORY` quando fornecidos como opções de tabela. `ALTER TABLE` permite-os apenas como opções de particionamento e exige que você tenha o privilégio `FILE`.

O uso de opções de tabela com `ALTER TABLE` fornece uma maneira conveniente de alterar as características de uma única tabela. Por exemplo:

* Se `t1` atualmente não for uma tabela `InnoDB`, esta instrução altera seu mecanismo de armazenamento para `InnoDB`:

  ```
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  + Veja a Seção 17.6.1.5, “Conversão de Tabelas de MyISAM para InnoDB” para considerações ao mudar tabelas para o mecanismo de armazenamento `InnoDB`.

  + Ao especificar uma cláusula `ENGINE`, `ALTER TABLE` reconstrui a tabela. Isso é verdadeiro mesmo que a tabela já tenha o mecanismo de armazenamento especificado.

  + Executar `ALTER TABLE tbl_name ENGINE=INNODB` em uma tabela `InnoDB existente` realiza uma operação `ALTER TABLE` “nulo`, que pode ser usada para desfragmentar uma tabela `InnoDB`, conforme descrito na Seção 17.11.4, “Desfragmentando uma Tabela”. Executar `ALTER TABLE tbl_name FORCE` em uma tabela `InnoDB` realiza a mesma função.

  + `ALTER TABLE tbl_name ENGINE=INNODB` e `ALTER TABLE tbl_name FORCE` usam DDL online. Para mais informações, consulte a Seção 17.12, “InnoDB e DDL Online”.

  + O resultado de tentar alterar o mecanismo de armazenamento de uma tabela é afetado pela disponibilidade do mecanismo de armazenamento desejado e pelo ajuste do modo `NO_ENGINE_SUBSTITUTION` SQL, conforme descrito na Seção 7.1.11, “Modos SQL do Servidor”.

  + Para evitar a perda acidental de dados, `ALTER TABLE` não pode ser usado para alterar o mecanismo de armazenamento de uma tabela para `MERGE` ou `BLACKHOLE`.

* Para alterar a tabela `InnoDB` para usar o formato de armazenamento de linhas compactado:

  ```
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* A cláusula `ENCRYPTION` habilita ou desabilita a criptografia de dados em nível de página para uma tabela `InnoDB`. Um plugin de chave deve ser instalado e configurado para habilitar a criptografia.

  Se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para usar uma cláusula `ENCRYPTION` com uma configuração diferente da configuração de criptografia do esquema padrão.

  A opção `ENCRYPTION` também é suportada para tabelas que residem em espaços de tabelas gerais.

  Para tabelas que residem em espaços de tabelas gerais, a criptografia de tabela e espaço de tabela deve corresponder.

  A opção `ENCRYPTION` é suportada apenas pelo motor de armazenamento `InnoDB`; portanto, ela só funciona se a tabela já estiver usando `InnoDB` (e você não alterar o motor de armazenamento da tabela) ou se a instrução `ALTER TABLE` especificar também `ENGINE=InnoDB`. Caso contrário, a instrução é rejeitada com `ER_CHECK_NOT_IMPLEMENTED`.

  Alterar a criptografia de tabela movendo uma tabela para um espaço de tabela diferente ou alterando o motor de armazenamento não é permitido sem especificar explicitamente uma cláusula `ENCRYPTION`.

  Especificar uma cláusula `ENCRYPTION` com um valor diferente de `'N'` ou `''` não é permitido se a tabela estiver usando um motor de armazenamento que não suporte criptografia. Tentar criar uma tabela sem uma cláusula `ENCRYPTION` em um esquema habilitado para criptografia usando um motor de armazenamento que não suporte criptografia também não é permitido.

  Para mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* Para redefinir o valor atual de autoincremento:

  ```
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

Você não pode redefinir o contador para um valor menor ou igual ao valor atualmente em uso. Para `InnoDB` e `MyISAM`, se o valor for menor ou igual ao valor máximo atualmente na coluna `AUTO_INCREMENT`, o valor é redefinido para o valor atual da coluna `AUTO_INCREMENT` mais um.

* Para alterar o conjunto de caracteres padrão da tabela:

  ```
  ALTER TABLE t1 CHARACTER SET = utf8mb4;
  ```

  Veja também Alterar o Conjunto de Caracteres.

* Para adicionar (ou alterar) um comentário da tabela:

  ```
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` com a opção `TABLESPACE` para mover tabelas `InnoDB` entre espaços de tabelas gerais existentes, espaços de tabelas por arquivo e o espaço de tabelas do sistema. Veja Mover Tabelas Entre Espaços de Tabelas Usando `ALTER TABLE`.

  + As operações `ALTER TABLE ... TABLESPACE` sempre causam uma reconstrução completa da tabela, mesmo que o atributo `TABLESPACE` não tenha mudado de seu valor anterior.

  + A sintaxe `ALTER TABLE ... TABLESPACE` não suporta mover uma tabela de um espaço de tabelas temporário para um espaço de tabelas persistente.

  + A cláusula `DATA DIRECTORY`, que é suportada com `CREATE TABLE ... TABLESPACE`, não é suportada com `ALTER TABLE ... TABLESPACE`, e é ignorada se especificada.

  + Para mais informações sobre as capacidades e limitações da opção `TABLESPACE`, veja `CREATE TABLE`.

* O MySQL NDB Cluster 9.5 suporta a definição de opções `NDB_TABLE` para controlar o equilíbrio de partições de uma tabela (tipo de contagem de fragmentos), capacidade de leitura de qualquer replica, replicação completa ou qualquer combinação dessas, como parte do comentário da tabela para uma instrução `ALTER TABLE` da mesma maneira que para `CREATE TABLE`, como mostrado neste exemplo:

  ```
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  Também é possível definir opções `NDB_COMMENT` para colunas de tabelas `NDB` como parte de uma instrução `ALTER TABLE`, como esta:

  ```
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=BLOB_INLINE_SIZE=4096,MAX_BLOB_PART_SIZE';
  ```

Tenha em mente que `ALTER TABLE ... COMMENT ...` descarta qualquer comentário existente para a tabela. Consulte Configurando opções de NDB_TABLE para obter informações e exemplos adicionais.

* As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` são usadas para especificar atributos de tabela, coluna e índice para motores de armazenamento primário e secundário. Essas opções são reservadas para uso futuro. Os atributos de índice não podem ser alterados. Um índice deve ser excluído e adicionado novamente com a mudança desejada, o que pode ser feito em uma única instrução `ALTER TABLE`.

Para verificar se as opções da tabela foram alteradas conforme o esperado, use `SHOW CREATE TABLE` ou consulte a tabela `TABLES` do Schema de Informações.

#### Requisitos de Desempenho e Espaço

As operações `ALTER TABLE` são processadas usando um dos seguintes algoritmos:

* `COPY`: As operações são realizadas em uma cópia da tabela original, e os dados da tabela são copiados da tabela original para a nova linha de tabela linha por linha. A DML concorrente não é permitida.

* `INPLACE`: As operações evitam a cópia dos dados da tabela, mas podem reconstruir a tabela no local. Pode ser tomada uma bloqueio exclusivo de metadados na tabela por um breve período durante as fases de preparação e execução da operação. Normalmente, a DML concorrente é suportada.

* `INSTANT`: As operações modificam apenas os metadados no dicionário de dados. Pode ser tomada uma bloqueio exclusivo de metadados na tabela por um breve período durante a fase de execução da operação. Os dados da tabela não são afetados, tornando as operações instantâneas. A DML concorrente é permitida.

Para tabelas que usam o motor de armazenamento `NDB`, esses algoritmos funcionam da seguinte forma:

* `COPY`: `NDB` cria uma cópia da tabela e a altera; o manipulador do NDB Cluster então copia os dados entre as versões antiga e nova da tabela. Posteriormente, `NDB` exclui a tabela antiga e renomeia a nova.

Isso é às vezes chamado de "cópia" ou "alteração offline" de `ALTER TABLE`.

* `INPLACE`: Os nós de dados fazem as alterações necessárias; o manipulador do NDB Cluster não copia dados ou participa de outra forma.

Isso é às vezes chamado de "alteração sem cópia" ou "online" de `ALTER TABLE`.

* `INSTANT`: Não é suportado pelo `NDB`.

Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.

A cláusula `ALGORITHM` é opcional. Se a cláusula `ALGORITHM` for omitida, o MySQL usa `ALGORITHM=INSTANT` para os motores de armazenamento e as cláusulas `ALTER TABLE` que a suportam. Caso contrário, é usado `ALGORITHM=INPLACE`. Se `ALGORITHM=INPLACE` não for suportado, é usado `ALGORITHM=COPY`.

Observação

Após adicionar uma coluna a uma tabela particionada usando `ALGORITHM=INSTANT`, não é mais possível realizar `ALTER TABLE ... EXCHANGE PARTITION` na tabela.

Especificar uma cláusula `ALGORITHM` exige que a operação use o algoritmo especificado para as cláusulas e os motores de armazenamento que a suportam, ou falhará com um erro caso contrário. Especificar `ALGORITHM=DEFAULT` é o mesmo que omitir a cláusula `ALGORITHM`.

As operações `ALTER TABLE` que utilizam o algoritmo `COPY` aguardam a conclusão de outras operações que estão modificando a tabela. Após as alterações serem aplicadas à cópia da tabela, os dados são copiados, a tabela original é excluída e a cópia da tabela é renomeada para o nome da tabela original. Enquanto a operação `ALTER TABLE` é executada, a tabela original é legível por outras sessões (com a exceção mencionada brevemente). As atualizações e escritas na tabela iniciadas após o início da operação `ALTER TABLE` são interrompidas até que a nova tabela esteja pronta, e são automaticamente redirecionadas para a nova tabela. A cópia temporária da tabela é criada no diretório do banco de dados da tabela original, a menos que seja uma operação `RENAME TO` que mova a tabela para um banco de dados que reside em um diretório diferente.

A exceção mencionada anteriormente é que as operações `ALTER TABLE` bloqueiam leituras (não apenas escritas) no ponto em que estão prontas para limpar as estruturas desatualizadas da tabela e os caches de definição da tabela. Neste ponto, ela deve adquirir um bloqueio exclusivo. Para isso, ela espera que os leitores atuais terminem e bloqueia novas leituras e escritas.

Uma operação `ALTER TABLE` que utiliza o algoritmo `COPY` impede operações DML concorrentes. As consultas concorrentes ainda são permitidas. Ou seja, uma operação de cópia de tabela sempre inclui pelo menos as restrições de concorrência de `LOCK=SHARED` (permitir consultas, mas não DML). Você pode restringir ainda mais a concorrência para operações que suportam a cláusula `LOCK`, especificando `LOCK=EXCLUSIVE`, o que impede DML e consultas. Para mais informações, consulte Controle de Concorrência.

Para forçar o uso do algoritmo `COPY` em uma operação `ALTER TABLE` que, de outra forma, não o usaria, especifique `ALGORITHM=COPY` ou habilite a variável de sistema `old_alter_table`. Se houver um conflito entre o ajuste `old_alter_table` e uma cláusula `ALGORITHM` com um valor diferente de `DEFAULT`, a cláusula `ALGORITHM` tem precedência.

Para tabelas `InnoDB`, uma operação `ALTER TABLE` que usa o algoritmo `COPY` em uma tabela que reside em um espaço de tabelas compartilhado pode aumentar a quantidade de espaço usada pelo espaço de tabelas. Tais operações requerem tanto espaço adicional quanto os dados na tabela mais os índices. Para uma tabela que reside em um espaço de tabelas compartilhado, o espaço adicional usado durante a operação não é liberado de volta ao sistema operacional, como acontece com uma tabela que reside em um espaço de tabelas por arquivo.

Para informações sobre os requisitos de espaço para operações DDL online, consulte a Seção 17.12.3, “Requisitos de Espaço DDL Online”.

As operações `ALTER TABLE` que suportam o algoritmo `INPLACE` incluem:

* Operações `ALTER TABLE` suportadas pela funcionalidade DDL online `InnoDB`. Consulte a Seção 17.12.1, “Operações DDL Online”.

* Renomear uma tabela. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Consulte a Seção 15.1.41, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

* Operações que modificam apenas o metadado da tabela. Essas operações são imediatas porque o servidor não toca o conteúdo da tabela. As operações que modificam apenas o metadado incluem:

  + Renomear uma coluna. No NDB Cluster, essa operação também pode ser realizada online.

  + Alterar o valor padrão de uma coluna (exceto para tabelas `NDB`).

+ Modificar a definição de uma coluna `ENUM` ou `SET` adicionando novos membros da enumeração ou do conjunto ao *final* da lista de valores de membro válidos, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

+ Alterar a definição de uma coluna espacial para remover o atributo `SRID`. (Adicionar ou alterar um atributo `SRID` requer uma reconstrução e não pode ser feito in loco, porque o servidor deve verificar se todos os valores têm o valor `SRID` especificado.)

+ Alterar o conjunto de caracteres de uma coluna, quando essas condições se aplicarem:

    - O tipo de dados da coluna é `CHAR`, `VARCHAR`, um tipo `TEXT` ou `ENUM`.

    - A mudança no conjunto de caracteres é de `utf8mb3` para `utf8mb4`, ou qualquer conjunto de caracteres para `binary`.

    - Não há índice na coluna.
  + Alterar uma coluna gerada, quando essas condições se aplicarem:

    - Para tabelas `InnoDB`, declarações que modificam colunas armazenadas geradas, mas não alteram seu tipo, expressão ou não-nulidade.

    - Para tabelas não `InnoDB`, declarações que modificam colunas armazenadas ou virtuais geradas, mas não alteram seu tipo, expressão ou não-nulidade.

Um exemplo de tal mudança é uma alteração no comentário da coluna.

* Renomear um índice.
* Adicionar ou excluir um índice secundário, para tabelas `InnoDB` e `NDB`. Veja a Seção 17.12.1, “Operações DDL Online”.

* Para as tabelas `NDB`, operações que adicionam e excluem índices em colunas de largura variável. Essas operações ocorrem online, sem cópia da tabela e sem bloquear ações DML concorrentes durante a maior parte de sua duração. Veja a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”.

* Modificando a visibilidade do índice com uma operação `ALTER INDEX`.

* Modificações de colunas em tabelas que contêm colunas geradas que dependem de colunas com um valor `DEFAULT`, desde que as colunas modificadas não estejam envolvidas nas expressões de colunas geradas. Por exemplo, alterar a propriedade `NULL` de uma coluna separada pode ser feito in loco sem uma reconstrução da tabela.

As operações `ALTER TABLE` que suportam o algoritmo `INSTANT` incluem:

* Adicionar uma coluna. Essa funcionalidade é referida como “`ADD COLUMN` instantâneo”. Aplicam-se limitações. Veja a Seção 17.12.1, “Operações DDL online”.

* Remover uma coluna. Essa funcionalidade é referida como “`DROP COLUMN` instantâneo”. Aplicam-se limitações. Veja a Seção 17.12.1, “Operações DDL online”.

* Adicionar ou remover uma coluna virtual.
* Adicionar ou remover um valor padrão de coluna.
* Modificar a definição de uma coluna `ENUM` ou `SET`. As mesmas restrições se aplicam como descritas acima para `ALGORITHM=INSTANT`.

* Alterar o tipo de índice.
* Renomear uma tabela. As mesmas restrições se aplicam como descritas acima para `ALGORITHM=INSTANT`.

Para mais informações sobre operações que suportam `ALGORITHM=INSTANT`, veja a Seção 17.12.1, “Operações DDL online”.

As atualizações `ALTER TABLE` convertem as colunas temporais do MySQL 5.5 para o formato 5.6 para as operações `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX` e `FORCE`. Essa conversão não pode ser realizada usando o algoritmo `INPLACE` porque a tabela deve ser reconstruída, portanto, especificar `ALGORITHM=INPLACE` nesses casos resulta em um erro. Especifique `ALGORITHM=COPY` se necessário.

Se uma operação `ALTER TABLE` em um índice de várias colunas usado para particionar uma tabela por `KEY` alterar a ordem das colunas, ela só pode ser realizada usando `ALGORITHM=COPY`.

As cláusulas `WITHOUT VALIDATION` e `WITH VALIDATION` afetam se a `ALTER TABLE` realiza uma operação in-place para modificações de colunas geradas virtualmente. Veja a Seção 15.1.11.2, “ALTER TABLE e Colunas Geradas”.

O NDB Cluster 9.5 suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. O `NDB` não permite alterar um espaço de tabela online. Consulte a Seção 25.6.12, “Operações Online com ALTER TABLE no NDB Cluster”, para mais informações.

Ao realizar uma cópia `ALTER TABLE`, o `NDB` verifica para garantir que nenhuma escrita concorrente tenha sido feita na tabela afetada. Se encontrar que alguma foi feita, o `NDB` rejeita a declaração `ALTER TABLE` e levanta `ER_TABLE_DEF_CHANGED`.

`ALTER TABLE` com `DISCARD ... PARTITION ... TABLESPACE` ou `IMPORT ... PARTITION ... TABLESPACE` não cria tabelas temporárias ou arquivos de partição temporários.

`ALTER TABLE` com `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION` ou `REORGANIZE PARTITION` não cria tabelas temporárias (exceto quando usadas com tabelas `NDB`); no entanto, essas operações podem e criam arquivos de partição temporários.

As operações `ADD` ou `DROP` para partições `RANGE` ou `LIST` são operações imediatas ou quase imediatas. As operações `ADD` ou `COALESCE` para partições `HASH` ou `KEY` copiam dados entre todas as partições, a menos que tenha sido usado `HASH LINEAR` ou `KEY LINEAR`; isso é efetivamente o mesmo que criar uma nova tabela, embora a operação `ADD` ou `COALESCE` seja realizada partição por partição. As operações `REORGANIZE` copiam apenas as partições alteradas e não tocam nas não alteradas.

Para tabelas `MyISAM`, você pode acelerar a recriação do índice (a parte mais lenta do processo de alteração) definindo a variável de sistema `myisam_sort_buffer_size` para um valor alto.

#### Controle de Concorrência

Para operações `ALTER TABLE` que a suportam, você pode usar a cláusula `LOCK` para controlar o nível de leituras e escritas concorrentes em uma tabela enquanto ela está sendo alterada. Especificar um valor não padrão para essa cláusula permite que você exija uma certa quantidade de acesso concorrente ou exclusividade durante a operação de alteração e interrompa a operação se o grau de bloqueio solicitado não estiver disponível.

Apenas `LOCK = DEFAULT` é permitido para operações que usam `ALGORITHM=INSTANT`. Os outros parâmetros da cláusula `LOCK` não são aplicáveis.

Os parâmetros para a cláusula `LOCK` são:

* `LOCK = DEFAULT`

  Nível máximo de concorrência para a cláusula `ALGORITHM` dada (se houver) e a operação `ALTER TABLE`: Permita leituras e escritas concorrentes se suportadas. Se não, permita leituras concorrentes se suportadas. Se não, enforce acesso exclusivo.

* `LOCK = NONE`

  Se suportado, permita leituras e escritas concorrentes. Caso contrário, ocorre um erro.

* `LOCK = SHARED`

Se suportado, permita leituras concorrentes, mas bloqueie escritas. As escritas são bloqueadas mesmo que as leituras/escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` dada (se houver) e a operação `ALTER TABLE`. Se as leituras concorrentes não forem suportadas, ocorre um erro.

* `LOCK = EXCLUSIVE`

  Força o acesso exclusivo. Isso é feito mesmo que as leituras/escritas concorrentes sejam suportadas pelo mecanismo de armazenamento para a cláusula `ALGORITHM` dada (se houver) e a operação `ALTER TABLE`.

#### Adicionando e Removendo Colunas

Use `ADD` para adicionar novas colunas a uma tabela e `DROP` para remover colunas existentes. `DROP col_name` é uma extensão do MySQL para o SQL padrão.

Para adicionar uma coluna em uma posição específica dentro de uma linha da tabela, use `FIRST` ou `AFTER col_name`. O padrão é adicionar a coluna por último.

Se uma tabela contiver apenas uma coluna, a coluna não pode ser removida. Se o que você pretende é remover a tabela, use a declaração `DROP TABLE` em vez disso.

Se colunas forem removidas de uma tabela, as colunas também são removidas de qualquer índice de que fazem parte. Se todas as colunas que compõem um índice forem removidas, o índice também é removido. Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para `ALTER TABLE ... ADD`, se a coluna tiver um valor padrão de expressão que usa uma função não determinística, a declaração pode produzir uma mensagem de aviso ou erro. Para mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados” e a Seção 19.1.3.7, “Restrições de replicação com GTIDs”.

#### Renomear, Redefinir e Rearranjar Colunas

As cláusulas `CHANGE`, `MODIFY`, `RENAME COLUMN` e `ALTER` permitem alterar os nomes e definições das colunas existentes. Elas têm essas características comparativas:

* `CHANGE`:

  + Pode renomear uma coluna e alterar sua definição, ou ambos.
  + Tem mais recursos do que `MODIFY` ou `RENAME COLUMN`, mas em detrimento da conveniência para algumas operações. `CHANGE` requer nomear a coluna duas vezes, se não renomeá-la, e requer especificar a definição da coluna novamente se apenas renomeá-la.
  + Com `FIRST` ou `AFTER`, pode reorganizar colunas.

* `MODIFY`:

  + Pode alterar a definição de uma coluna, mas não seu nome.
  + Mais conveniente do que `CHANGE` para alterar a definição de uma coluna sem renomeá-la.

  + Com `FIRST` ou `AFTER`, pode reorganizar colunas.

* `RENAME COLUMN`:

  + Pode alterar o nome de uma coluna, mas não sua definição.
  + Mais conveniente do que `CHANGE` para renomear uma coluna sem alterar sua definição.

* `ALTER`: Usado apenas para alterar o valor padrão de uma coluna.

`CHANGE` é uma extensão do MySQL para o SQL padrão. `MODIFY` e `RENAME COLUMN` são extensões do MySQL para compatibilidade com Oracle.

Para alterar uma coluna para alterar tanto seu nome quanto sua definição, use `CHANGE`, especificando os nomes antigos e novos e a nova definição. Por exemplo, para renomear uma coluna `INT NOT NULL` de `a` para `b` e alterar sua definição para usar o tipo de dados `BIGINT` enquanto mantém o atributo `NOT NULL`, faça isso:

```
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

Para alterar a definição de uma coluna, mas não seu nome, use `CHANGE` ou `MODIFY`. Com `CHANGE`, a sintaxe requer dois nomes de coluna, então você deve especificar o mesmo nome duas vezes para não alterar o nome. Por exemplo, para alterar a definição da coluna `b`, faça isso:

```
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`ALTERAR` é mais conveniente para alterar a definição sem alterar o nome, pois requer o nome da coluna apenas uma vez:

```
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

Para alterar o nome de uma coluna, mas não sua definição, use `ALTERAR` ou `RENOMEAR COLUNA`. Com `ALTERAR`, a sintaxe requer uma definição de coluna, então para deixar a definição inalterada, você deve especificar a definição atual da coluna. Por exemplo, para renomear uma coluna `INT NOT NULL` de `b` para `a`, faça isso:

```
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

`RENOMEAR COLUNA` é mais conveniente para alterar o nome sem alterar a definição, pois requer apenas os nomes antigo e novo:

```
ALTER TABLE t1 RENAME COLUMN b TO a;
```

Em geral, você não pode renomear uma coluna para um nome que já existe na tabela. No entanto, isso nem sempre é o caso, como quando você troca nomes ou os move através de um ciclo. Se uma tabela tiver colunas chamadas `a`, `b` e `c`, essas são operações válidas:

```
-- swap a and b
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO a;
-- "rotate" a, b, c through a cycle
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO c,
               RENAME COLUMN c TO a;
```

Para alterações de definição de coluna usando `ALTERAR` ou `ALTERAR`, a definição deve incluir o tipo de dados e todos os atributos que devem ser aplicados à nova coluna, exceto atributos de índice como `CHAVE PRIMÁRIA` ou `ÚNICA`. Atributos presentes na definição original, mas não especificados para a nova definição, não são carregados. Suponha que uma coluna `col1` seja definida como `INT UNSIGNED DEFAULT 1 COMMENT 'minha coluna'` e você modifique a coluna da seguinte forma, com a intenção de alterar apenas `INT` para `BIGINT`:

```
ALTER TABLE t1 MODIFY col1 BIGINT;
```

Essa declaração altera o tipo de dados de `INT` para `BIGINT`, mas também exclui os atributos `UNSIGNED`, `DEFAULT` e `COMMENT`. Para mantê-los, a declaração deve incluí-los explicitamente:

```
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

Para alterações de tipo de dados usando `ALTERAR` ou `ALTERAR`, o MySQL tenta converter os valores existentes das colunas para o novo tipo o melhor possível.

Aviso

Essa conversão pode resultar na alteração dos dados. Por exemplo, se você encurtar uma coluna de texto, os valores podem ser truncados. Para evitar que a operação seja bem-sucedida se as conversões para o novo tipo de dado resultar em perda de dados, habilite o modo SQL rigoroso antes de usar `ALTER TABLE` (consulte a Seção 7.1.11, “Modos SQL do Servidor”).

Se você usar `CHANGE` ou `MODIFY` para encurtar uma coluna para a qual existe um índice na coluna, e o comprimento da coluna resultante for menor que o comprimento do índice, o MySQL encurta o índice automaticamente.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL renomeia automaticamente essas referências para a coluna renomeada:

* Índices que referem à coluna antiga, incluindo índices invisíveis e índices `MyISAM` desativados.

* Chaves estrangeiras que referem à coluna antiga.

Para colunas renomeadas por `CHANGE` ou `RENAME COLUMN`, o MySQL não renomeia automaticamente essas referências para a coluna renomeada:

* Expressões de coluna geradas e de partição que referem à coluna renomeada. Você deve usar `CHANGE` para redefinir essas expressões na mesma declaração `ALTER TABLE` que a que renomeia a coluna.

* Visualizações e programas armazenados que referem à coluna renomeada. Você deve alterar manualmente a definição desses objetos para referir ao novo nome da coluna.

Para reorganizar colunas dentro de uma tabela, use `FIRST` e `AFTER` nas operações `CHANGE` ou `MODIFY`.

`ALTER ... SET DEFAULT` ou `ALTER ... DROP DEFAULT` especificam um novo valor padrão para uma coluna ou removem o valor padrão antigo, respectivamente. Se o valor padrão antigo for removido e a coluna puder ser `NULL`, o novo valor padrão é `NULL`. Se a coluna não puder ser `NULL`, o MySQL atribui um valor padrão conforme descrito na Seção 13.6, “Valores padrão de tipo de dado”.

`ALTER ... SET VISÍVEL` e `ALTER ... SET INVISÍVEL` permitem alterar a visibilidade da coluna. Veja a Seção 15.1.24.10, “Colunas Invisíveis”.

#### Chaves Primárias e Índices

`DROP PRIMARY KEY` remove a chave primária. Se não houver chave primária, ocorrerá um erro. Para obter informações sobre as características de desempenho das chaves primárias, especialmente para tabelas `InnoDB`, consulte a Seção 10.3.2, “Otimização de Chave Primária”.

Se a variável de sistema `sql_require_primary_key` estiver habilitada, tentar remover uma chave primária produz um erro.

Se você adicionar um `UNIQUE INDEX` ou `PRIMARY KEY` a uma tabela, o MySQL armazena-o antes de qualquer índice não exclusivo para permitir a detecção de chaves duplicadas o mais cedo possível.

`DROP INDEX` remove um índice. Esta é uma extensão do MySQL para o SQL padrão. Veja a Seção 15.1.31, “Instrução DROP INDEX”. Para determinar os nomes dos índices, use `SHOW INDEX FROM tbl_name`.

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. A sintaxe para o especificador *`index_type`* é `USING type_name`. Para detalhes sobre `USING`, consulte a Seção 15.1.18, “Instrução CREATE INDEX”. A posição preferida é após a lista de colunas. Espere o suporte para a opção de uso antes da lista de colunas ser removida em uma futura versão do MySQL.

Os valores de *`index_option`* especificam opções adicionais para um índice. `USING` é uma dessas opções. Para detalhes sobre os valores de *`index_option`* permitidos, consulte a Seção 15.1.18, “Instrução CREATE INDEX”.

`RENAME INDEX old_index_name TO new_index_name` renomeia um índice. Esta é uma extensão do MySQL para o SQL padrão. O conteúdo da tabela permanece inalterado. *`old_index_name`* deve ser o nome de um índice existente na tabela que não seja excluído pela mesma instrução `ALTER TABLE`. *`new_index_name`* é o novo nome do índice, que não pode duplicar o nome de um índice na tabela resultante após as alterações terem sido aplicadas. Nenhum nome de índice pode ser `PRIMARY`.

Se você usar `ALTER TABLE` em uma tabela `MyISAM`, todos os índices não únicos são criados em um lote separado (como no caso de `REPAIR TABLE`). Isso deve tornar `ALTER TABLE` muito mais rápido quando você tiver muitos índices.

Para tabelas `MyISAM`, a atualização de chaves pode ser controlada explicitamente. Use `ALTER TABLE ... DISABLE KEYS` para dizer ao MySQL para parar de atualizar índices não únicos. Em seguida, use `ALTER TABLE ... ENABLE KEYS` para recriar índices ausentes. `MyISAM` faz isso com um algoritmo especial que é muito mais rápido do que inserir chaves uma a uma, então desabilitar chaves antes de realizar operações de inserção em lote deve dar um aumento considerável de velocidade. Usar `ALTER TABLE ... DISABLE KEYS` requer o privilégio `INDEX` além dos privilégios mencionados anteriormente.

Enquanto os índices não únicos estão desabilitados, eles são ignorados para instruções como `SELECT` e `EXPLAIN` que, de outra forma, os usariam.

Após uma instrução `ALTER TABLE`, pode ser necessário executar `ANALYZE TABLE` para atualizar a informação de cardinalidade do índice. Veja a Seção 15.7.7.24, “Instrução SHOW INDEX”.

A operação `ALTER INDEX` permite que um índice seja tornado visível ou invisível. Um índice invisível não é usado pelo otimizador. A modificação da visibilidade do índice aplica-se a índices que não sejam chaves primárias (explícitos ou implícitos) e não pode ser realizada usando `ALGORITHM=INSTANT`. Este recurso é neutro em relação ao motor de armazenamento (suportável para qualquer motor). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

#### Chaves Estrangeiras e Outras Restrições

As cláusulas `FOREIGN KEY` e `REFERENCES` são suportadas pelos motores de armazenamento `InnoDB` e `NDB`, que implementam `ADD [CONSTRAINT [símbolo]] FOREIGN KEY [nome_índice] (...) REFERENCES ... (...)`. Consulte a Seção 15.1.24.5, “Restrições de Chaves Estrangeiras”. Para outros motores de armazenamento, as cláusulas são analisadas, mas ignoradas.

Para `ALTER TABLE`, ao contrário de `CREATE TABLE`, `ADD FOREIGN KEY` ignora *`nome_índice`* se fornecido e usa um nome de chave estrangeira gerado automaticamente. Como solução alternativa, inclua a cláusula `CONSTRAINT` para especificar o nome da chave estrangeira:

```
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Importante

O MySQL ignora silenciosamente as especificações inline de `REFERENCES`, onde as referências são definidas como parte da especificação da coluna. O MySQL aceita apenas as cláusulas `REFERENCES` definidas como parte de uma especificação de chave estrangeira separada.

Nota

Tabelas `InnoDB` particionadas não suportam chaves estrangeiras. Esta restrição não se aplica a tabelas `NDB`, incluindo aquelas particionadas explicitamente por `[LINEAR] KEY`. Para mais informações, consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

O MySQL Server e o NDB Cluster ambos suportam o uso de `ALTER TABLE` para descartar chaves estrangeiras:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

A adição e a remoção de uma chave estrangeira na mesma instrução `ALTER TABLE` são suportadas para `ALTER TABLE ... ALGORITHM=INPLACE`, mas não para `ALTER TABLE ... ALGORITHM=COPY`.

O servidor proíbe alterações nas colunas da chave estrangeira que possam causar perda de integridade referencial. Uma solução é usar `ALTER TABLE ... DROP FOREIGN KEY` antes de alterar a definição da coluna e `ALTER TABLE ... ADD FOREIGN KEY` depois. Exemplos de alterações proibidas incluem:

* Alterações no tipo de dados das colunas da chave estrangeira que possam ser inseguras. Por exemplo, alterar `VARCHAR(20)` para `VARCHAR(30)` é permitido, mas alterá-lo para `VARCHAR(1024)` não é, pois isso altera o número de bytes de comprimento necessários para armazenar valores individuais.

* Alterar uma coluna `NULL` para `NOT NULL` no modo não estrito é proibido para evitar a conversão de valores `NULL` para valores padrão `NOT NULL`, para os quais não existem valores correspondentes na tabela referenciada. A operação é permitida no modo estrito, mas um erro é retornado se alguma conversão for necessária.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera internamente os nomes das restrições de chave estrangeira geradas e os nomes de restrições de chave estrangeira definidas pelo usuário que começam com a string “*`tbl_name`*_ibfk_” para refletir o novo nome da tabela. O `InnoDB` interpreta os nomes das restrições de chave estrangeira que começam com a string “*`tbl_name`*_ibfk_” como nomes gerados internamente.

`ALTER TABLE` permite que restrições `CHECK` para tabelas existentes sejam adicionadas, removidas ou alteradas:

* Adicione uma nova restrição `CHECK`:

  ```
  ALTER TABLE tbl_name
      ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED];
  ```

  O significado dos elementos de sintaxe da restrição é o mesmo que para `CREATE TABLE`. Veja a Seção 15.1.24.6, “Restrições `CHECK`”.

* Remova uma restrição `CHECK` existente nomeada *`symbol`*:

  ```
  ALTER TABLE tbl_name
      DROP CHECK symbol;
  ```

* Alterar se uma restrição `CHECK` existente nomeada *`símbolo`* é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CHECK symbol [NOT] ENFORCED;
  ```

As cláusulas `DROP CHECK` e `ALTER CHECK` são extensões do MySQL para o SQL padrão.

O `ALTER TABLE` permite uma sintaxe mais geral (e padrão do SQL) para a remoção e alteração de restrições existentes de qualquer tipo, onde o tipo de restrição é determinado pelo nome da restrição:

* Remover uma restrição existente nomeada *`símbolo`*:

  ```
  ALTER TABLE tbl_name
      DROP CONSTRAINT symbol;
  ```

  Se a variável de sistema `sql_require_primary_key` estiver habilitada, tentar remover uma chave primária produz um erro.

* Alterar se uma restrição existente nomeada *`símbolo`* é aplicada:

  ```
  ALTER TABLE tbl_name
      ALTER CONSTRAINT symbol [NOT] ENFORCED;
  ```

  Apenas as restrições `CHECK` podem ser alteradas para não serem aplicadas. Todos os outros tipos de restrição são sempre aplicados.

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, check) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema. Consequentemente, os nomes de cada tipo de restrição devem ser únicos por esquema, mas restrições de diferentes tipos podem ter o mesmo nome. Quando várias restrições têm o mesmo nome, `DROP CONSTRAINT` e `ADD CONSTRAINT` são ambíguos e ocorre um erro. Nesses casos, deve-se usar a sintaxe específica da restrição para modificar a restrição. Por exemplo, use `DROP PRIMARY KEY` ou DROP FOREIGN KEY para remover uma chave primária ou estrangeira.

Se uma alteração na tabela causar uma violação de uma restrição `CHECK` aplicada, ocorre um erro e a tabela não é modificada. Exemplos de operações para as quais ocorre um erro:

* Tentativas de adicionar o atributo `AUTO_INCREMENT` a uma coluna que é usada em uma restrição `CHECK`.

* Tentativas de adicionar uma restrição `CHECK` imposta ou aplicar uma restrição `CHECK` não imposta cuja condição viole as restrições existentes.

* Tentativas de modificar, renomear ou excluir uma coluna que seja usada em uma restrição `CHECK`, a menos que essa restrição também seja excluída na mesma instrução. Exceção: Se uma restrição `CHECK` se referir apenas a uma única coluna, a exclusão da coluna exclui automaticamente a restrição.

`ALTER TABLE tbl_name RENAME new_tbl_name` altera internamente os nomes das restrições `CHECK` geradas pelo usuário e definidos pelo usuário que começam com a string “*`tbl_name`*_chk_” para refletir o novo nome da tabela. O MySQL interpreta os nomes das restrições `CHECK` que começam com a string “*`tbl_name`*_chk_” como nomes gerados internamente.

#### Mudando o Conjunto de Caracteres

Para alterar o conjunto de caracteres padrão da tabela e todas as colunas de caracteres (`CHAR`, `VARCHAR`, `TEXT`) para um novo conjunto de caracteres, use uma instrução como esta:

```
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

A instrução também altera a collation de todas as colunas de caracteres. Se você não especificar a cláusula `COLLATE` para indicar qual collation usar, a instrução usa a collation padrão para o conjunto de caracteres. Se essa collation for inadequada para o uso pretendido da tabela (por exemplo, se mudaria de uma collation sensível ao caso para uma collation insensível ao caso), especifique uma collation explicitamente.

Para uma coluna com um tipo de dados de `VARCHAR` ou um dos tipos `TEXT`, `CONVERT TO CHARACTER SET` altera o tipo de dados conforme necessário para garantir que a nova coluna tenha o tamanho suficiente para armazenar tantos caracteres quanto a coluna original. Por exemplo, uma coluna `TEXT` tem dois bytes de comprimento, que armazenam o comprimento em bytes dos valores na coluna, até um máximo de 65.535. Para uma coluna `TEXT` `latin1`, cada caractere requer um único byte, então a coluna pode armazenar até 65.535 caracteres. Se a coluna for convertida para `utf8mb4`, cada caractere pode requerer até 4 bytes, para um comprimento máximo possível de 4 × 65.535 = 262.140 bytes. Esse comprimento não cabe nos bytes de comprimento de uma coluna `TEXT`, então o MySQL converte o tipo de dados para `MEDIUMTEXT`, que é o menor tipo de string para o qual os bytes de comprimento podem registrar um valor de 262.140. Da mesma forma, uma coluna `VARCHAR` pode ser convertida para `MEDIUMTEXT`.

Para evitar mudanças de tipo de dados do tipo descrito acima, não use `CONVERT TO CHARACTER SET`. Em vez disso, use `MODIFY` para alterar colunas individuais. Por exemplo:

```
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8mb4;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8mb4;
```

Se você especificar `CONVERT TO CHARACTER SET binary`, as colunas `CHAR`, `VARCHAR` e `TEXT` são convertidas para seus tipos de string binários correspondentes (`BINARY`, `VARBINARY`, `BLOB`). Isso significa que as colunas não têm mais um conjunto de caracteres e uma operação subsequente de `CONVERT TO` não se aplica a elas.

Se *`charset_name`* for `DEFAULT` em uma operação `CONVERT TO CHARACTER SET`, o conjunto de caracteres nomeado pela variável de sistema `character_set_database` é usado.

Aviso

A operação `CONVERT TO` converte os valores das colunas entre os conjuntos de caracteres originais e nomeados. Isso *não* é o que você deseja se tiver uma coluna em um conjunto de caracteres (como `latin1`) mas os valores armazenados usam, na verdade, outro conjunto de caracteres incompatível (como `utf8mb4`). Nesse caso, você deve fazer o seguinte para cada coluna desse tipo:

```
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8mb4;
```

A razão pela qual isso funciona é que não há conversão quando você converte para ou a partir de colunas `BLOB`.

Para alterar apenas o *conjunto de caracteres padrão* para uma tabela, use esta instrução:

```
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

A palavra `DEFAULT` é opcional. O conjunto de caracteres padrão é o conjunto de caracteres que é usado se você não especificar o conjunto de caracteres para colunas que você adicionar a uma tabela mais tarde (por exemplo, com `ALTER TABLE ... ADD column`).

Quando a variável de sistema `foreign_key_checks` está habilitada, que é o ajuste padrão, a conversão de conjuntos de caracteres não é permitida em tabelas que incluem uma coluna de string de caracteres usada em uma restrição de chave estrangeira. A solução é desabilitar `foreign_key_checks` antes de realizar a conversão de conjuntos de caracteres. Você deve realizar a conversão em ambas as tabelas envolvidas na restrição de chave estrangeira antes de reativar `foreign_key_checks`. Se você reativar `foreign_key_checks` após converter apenas uma das tabelas, uma operação `ON DELETE CASCADE` ou `ON UPDATE CASCADE` pode corromper os dados na tabela referenciada devido à conversão implícita que ocorre durante essas operações (Bug
#45290, Bug #74816).

#### Importando Tabelas InnoDB

Uma tabela `InnoDB` criada em seu próprio espaço de tabelas por arquivo pode ser importada a partir de um backup ou de outra instância do servidor MySQL usando as cláusulas `DISCARD TABLEPACE` e `IMPORT TABLESPACE`. Veja a Seção 17.6.1.3, “Importando Tabelas InnoDB”.

#### Ordem de Registro para Tabelas MyISAM

A opção `ORDER BY` permite que você crie a nova tabela com as linhas em uma ordem específica. Essa opção é útil principalmente quando você sabe que consulta as linhas em uma ordem específica a maior parte do tempo. Ao usar essa opção após alterações importantes na tabela, você pode obter um desempenho maior. Em alguns casos, isso pode facilitar o ordenamento do MySQL se a tabela estiver ordenada pelo(s) campo(s) pelo qual(is) você deseja ordená-la posteriormente.

Nota

A tabela não permanece na ordem especificada após inserções e exclusões.

A sintaxe `ORDER BY` permite que um ou mais nomes de campo sejam especificados para o ordenamento, cada um dos quais pode ser opcionalmente seguido por `ASC` ou `DESC` para indicar a ordem de classificação ascendente ou descendente, respectivamente. O padrão é a ordem ascendente. Apenas nomes de campo são permitidos como critérios de classificação; expressões arbitrárias não são permitidas. Esta cláusula deve ser a última a ser dada após qualquer outra cláusula.

`ORDER BY` não faz sentido para tabelas `InnoDB` porque `InnoDB` sempre ordena as linhas da tabela de acordo com o índice agrupado.

Quando usada em uma tabela particionada, `ALTER TABLE ... ORDER BY` ordena as linhas dentro de cada partição apenas.

#### Opções de Partição

*`partition_options`* significa opções que podem ser usadas com tabelas particionadas para repartir, adicionar, excluir, descartar, importar, mesclar e dividir partições, e para realizar manutenção de particionamento.

É possível que uma instrução `ALTER TABLE` contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` como adição a outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último, após qualquer outra especificação. As opções `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em uma única instrução `ALTER TABLE`, pois as opções listadas acima atuam em partições individuais.

Para obter mais informações sobre as opções de partição, consulte a Seção 15.1.24, “Instrução CREATE TABLE”, e a Seção 15.1.11.1, “Operações de Partição ALTER TABLE”. Para informações e exemplos sobre as instruções `ALTER TABLE ... EXCHANGE PARTITION`, consulte a Seção 26.3.3, “Troca de Partições e Subpartições com Tabelas”.