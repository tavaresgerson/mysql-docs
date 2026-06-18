#### 14.6.2.4 InnoDB Full-Text Indexes

Full-text indexes são criados em colunas baseadas em texto (colunas `CHAR`, `VARCHAR` ou `TEXT`) para acelerar Queries e operações DML em dados contidos nessas colunas.

Um full-text index é definido como parte de uma instrução `CREATE TABLE` ou adicionado a uma tabela existente usando `ALTER TABLE` ou `CREATE INDEX`.

A full-text search é realizada usando a sintaxe `MATCH() ... AGAINST`. Para informações de uso, consulte a Seção 12.9, “Full-Text Search Functions”.

Os full-text indexes do `InnoDB` são descritos sob os seguintes tópicos nesta seção:

* InnoDB Full-Text Index Design
* InnoDB Full-Text Index Tables
* InnoDB Full-Text Index Cache
* InnoDB Full-Text Index DOC_ID and FTS_DOC_ID Column
* InnoDB Full-Text Index Deletion Handling
* InnoDB Full-Text Index Transaction Handling
* Monitoring InnoDB Full-Text Indexes

##### InnoDB Full-Text Index Design

Os full-text indexes do `InnoDB` têm um design de inverted index. Inverted indexes armazenam uma lista de palavras e, para cada palavra, uma lista de documentos nos quais a palavra aparece. Para oferecer suporte à proximity search, a informação de posição para cada palavra também é armazenada, como um byte offset.

##### InnoDB Full-Text Index Tables

Quando um full-text index do `InnoDB` é criado, um conjunto de index tables é criado, conforme mostrado no exemplo a seguir:

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200),
       FULLTEXT idx (opening_line)
       ) ENGINE=InnoDB;

mysql> SELECT table_id, name, space from INFORMATION_SCHEMA.INNODB_SYS_TABLES
       WHERE name LIKE 'test/%';
+----------+----------------------------------------------------+-------+
| table_id | name                                               | space |
+----------+----------------------------------------------------+-------+
|      333 | test/FTS_0000000000000147_00000000000001c9_INDEX_1 |   289 |
|      334 | test/FTS_0000000000000147_00000000000001c9_INDEX_2 |   290 |
|      335 | test/FTS_0000000000000147_00000000000001c9_INDEX_3 |   291 |
|      336 | test/FTS_0000000000000147_00000000000001c9_INDEX_4 |   292 |
|      337 | test/FTS_0000000000000147_00000000000001c9_INDEX_5 |   293 |
|      338 | test/FTS_0000000000000147_00000000000001c9_INDEX_6 |   294 |
|      330 | test/FTS_0000000000000147_BEING_DELETED            |   286 |
|      331 | test/FTS_0000000000000147_BEING_DELETED_CACHE      |   287 |
|      332 | test/FTS_0000000000000147_CONFIG                   |   288 |
|      328 | test/FTS_0000000000000147_DELETED                  |   284 |
|      329 | test/FTS_0000000000000147_DELETED_CACHE            |   285 |
|      327 | test/opening_lines                                 |   283 |
+----------+----------------------------------------------------+-------+
```

As seis primeiras index tables compreendem o inverted index e são referidas como auxiliary index tables. Quando os documentos de entrada são tokenizados, as palavras individuais (também referidas como “tokens”) são inseridas nas index tables junto com informações de posição e um `DOC_ID` associado. As palavras são totalmente ordenadas e particionadas entre as seis index tables com base no peso de ordenação do conjunto de caracteres do primeiro caractere da palavra.

O inverted index é particionado em seis auxiliary index tables para suportar a criação paralela de Index. Por padrão, dois Threads tokenizam, ordenam e inserem palavras e dados associados nas index tables. O número de Threads que realizam este trabalho é configurável usando a variável `innodb_ft_sort_pll_degree`. Considere aumentar o número de Threads ao criar full-text indexes em tabelas grandes.

Os nomes das auxiliary index tables são prefixados com `fts_` e sufixados com `index_#`. Cada auxiliary index table está associada à tabela indexada por um valor hexadecimal no nome da auxiliary index table que corresponde ao `table_id` da tabela indexada. Por exemplo, o `table_id` da tabela `test/opening_lines` é `327`, para o qual o valor hexadecimal é 0x147. Conforme mostrado no exemplo anterior, o valor hexadecimal “147” aparece nos nomes das auxiliary index tables que estão associadas à tabela `test/opening_lines`.

Um valor hexadecimal representando o `index_id` do full-text index também aparece nos nomes das auxiliary index tables. Por exemplo, no nome da tabela auxiliar `test/FTS_0000000000000147_00000000000001c9_INDEX_1`, o valor hexadecimal `1c9` tem um valor decimal de 457. O Index definido na tabela `opening_lines` (`idx`) pode ser identificado consultando a tabela `INNODB_SYS_INDEXES` do Information Schema para este valor (457).

```sql
mysql> SELECT index_id, name, table_id, space from INFORMATION_SCHEMA.INNODB_SYS_INDEXES
       WHERE index_id=457;
+----------+------+----------+-------+
| index_id | name | table_id | space |
+----------+------+----------+-------+
|      457 | idx  |      327 |   283 |
+----------+------+----------+-------+
```

As Index tables são armazenadas em seu próprio tablespace se a tabela primária for criada em um tablespace file-per-table. Caso contrário, as index tables são armazenadas no tablespace onde reside a tabela indexada.

As outras index tables mostradas no exemplo anterior são referidas como common index tables e são usadas para deletion handling e para armazenar o estado interno dos full-text indexes. Diferentemente das inverted index tables, que são criadas para cada full-text index, este conjunto de tabelas é comum a todos os full-text indexes criados em uma tabela específica.

Common index tables são retidas mesmo que os full-text indexes sejam removidos (dropped). Quando um full-text index é removido, a coluna `FTS_DOC_ID` que foi criada para o Index é retida, pois remover a coluna `FTS_DOC_ID` exigiria o rebuild da tabela previamente indexada. As common index tables são necessárias para gerenciar a coluna `FTS_DOC_ID`.

* `FTS_*_DELETED` and `FTS_*_DELETED_CACHE`

  Contêm os IDs de documento (`DOC_ID`) para documentos que foram excluídos, mas cujos dados ainda não foram removidos do full-text index. A `FTS_*_DELETED_CACHE` é a versão em memória da tabela `FTS_*_DELETED`.

* `FTS_*_BEING_DELETED` and `FTS_*_BEING_DELETED_CACHE`

  Contêm os IDs de documento (`DOC_ID`) para documentos que foram excluídos e cujos dados estão atualmente em processo de remoção do full-text index. A tabela `FTS_*_BEING_DELETED_CACHE` é a versão em memória da tabela `FTS_*_BEING_DELETED`.

* `FTS_*_CONFIG`

  Armazena informações sobre o estado interno do full-text index. Mais importante, armazena o `FTS_SYNCED_DOC_ID`, que identifica os documentos que foram parseados e tiveram o Flush realizado para o disco. Em caso de crash recovery, os valores de `FTS_SYNCED_DOC_ID` são usados para identificar documentos que não tiveram o Flush realizado para o disco, para que possam ser re-parseados e adicionados de volta ao full-text index Cache. Para visualizar os dados nesta tabela, consulte a tabela `INNODB_FT_CONFIG` do Information Schema.

##### InnoDB Full-Text Index Cache

Quando um documento é inserido, ele é tokenizado, e as palavras individuais e dados associados são inseridos no full-text index. Este processo, mesmo para documentos pequenos, pode resultar em inúmeras pequenas inserções nas auxiliary index tables, tornando o acesso concorrente a essas tabelas um ponto de contenção. Para evitar este problema, o `InnoDB` usa um full-text index Cache para armazenar temporariamente em Cache as inserções das index tables para linhas inseridas recentemente. Esta estrutura de Cache em memória retém as inserções até que o Cache esteja cheio e, em seguida, realiza o Flush delas em lote para o disco (para as auxiliary index tables). Você pode consultar a tabela `INNODB_FT_INDEX_CACHE` do Information Schema para visualizar dados tokenizados de linhas inseridas recentemente.

O comportamento de caching e Flush em lote evita atualizações frequentes nas auxiliary index tables, o que poderia resultar em problemas de acesso concorrente durante períodos de alta atividade de inserção e atualização. A técnica de lote também evita múltiplas inserções para a mesma palavra e minimiza entradas duplicadas. Em vez de realizar o Flush de cada palavra individualmente, as inserções para a mesma palavra são mescladas e têm o Flush realizado para o disco como uma única entrada, melhorando a eficiência da inserção e mantendo as auxiliary index tables o menor possível.

A variável `innodb_ft_cache_size` é usada para configurar o tamanho do full-text index Cache (por tabela), o que afeta a frequência com que o full-text index Cache tem o Flush realizado. Você também pode definir um limite global de tamanho de full-text index Cache para todas as tabelas em uma determinada instância usando a variável `innodb_ft_total_cache_size`.

O full-text index Cache armazena as mesmas informações que as auxiliary index tables. No entanto, o full-text index Cache armazena em Cache apenas dados tokenizados para linhas inseridas recentemente. Os dados que já tiveram o Flush realizado para o disco (para as auxiliary index tables) não são trazidos de volta para o full-text index Cache quando consultados. Os dados nas auxiliary index tables são consultados diretamente, e os resultados das auxiliary index tables são mesclados com os resultados do full-text index Cache antes de serem retornados.

##### InnoDB Full-Text Index DOC_ID and FTS_DOC_ID Column

`InnoDB` usa um identificador de documento exclusivo, referido como `DOC_ID`, para mapear palavras no full-text index para registros de documentos onde a palavra aparece. O mapeamento requer uma coluna `FTS_DOC_ID` na tabela indexada. Se uma coluna `FTS_DOC_ID` não for definida, o `InnoDB` adiciona automaticamente uma coluna `FTS_DOC_ID` oculta quando o full-text index é criado. O exemplo a seguir demonstra este comportamento.

A seguinte definição de tabela não inclui uma coluna `FTS_DOC_ID`:

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Quando você cria um full-text index na tabela usando a sintaxe `CREATE FULLTEXT INDEX`, um warning é retornado, informando que o `InnoDB` está realizando o rebuild da tabela para adicionar a coluna `FTS_DOC_ID`.

```sql
mysql> CREATE FULLTEXT INDEX idx ON opening_lines(opening_line);
Query OK, 0 rows affected, 1 warning (0.19 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------------+
| Level   | Code | Message                                          |
+---------+------+--------------------------------------------------+
| Warning |  124 | InnoDB rebuilding table to add column FTS_DOC_ID |
+---------+------+--------------------------------------------------+
```

O mesmo warning é retornado ao usar `ALTER TABLE` para adicionar um full-text index a uma tabela que não possui uma coluna `FTS_DOC_ID`. Se você criar um full-text index no momento do `CREATE TABLE` e não especificar uma coluna `FTS_DOC_ID`, o `InnoDB` adiciona uma coluna `FTS_DOC_ID` oculta, sem aviso.

Definir uma coluna `FTS_DOC_ID` no momento do `CREATE TABLE` é menos custoso do que criar um full-text index em uma tabela que já está carregada com dados. Se uma coluna `FTS_DOC_ID` for definida em uma tabela antes do carregamento dos dados, a tabela e seus Indexes não precisam ser rebuilt para adicionar a nova coluna. Se você não se preocupa com a performance do `CREATE FULLTEXT INDEX`, omita a coluna `FTS_DOC_ID` para que o `InnoDB` a crie para você. O `InnoDB` cria uma coluna `FTS_DOC_ID` oculta junto com um unique index (`FTS_DOC_ID_INDEX`) na coluna `FTS_DOC_ID`. Se você quiser criar sua própria coluna `FTS_DOC_ID`, a coluna deve ser definida como `BIGINT UNSIGNED NOT NULL` e nomeada `FTS_DOC_ID` (em maiúsculas), como no exemplo a seguir:

Note

A coluna `FTS_DOC_ID` não precisa ser definida como uma coluna `AUTO_INCREMENT`, mas fazê-lo pode facilitar o carregamento de dados.

```sql
mysql> CREATE TABLE opening_lines (
       FTS_DOC_ID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Se você optar por definir a coluna `FTS_DOC_ID` por conta própria, você é responsável por gerenciar a coluna para evitar valores vazios ou duplicados. Os valores de `FTS_DOC_ID` não podem ser reutilizados, o que significa que os valores de `FTS_DOC_ID` devem ser sempre crescentes.

Opcionalmente, você pode criar o `FTS_DOC_ID_INDEX` exclusivo (em maiúsculas) necessário na coluna `FTS_DOC_ID`.

```sql
mysql> CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on opening_lines(FTS_DOC_ID);
```

Se você não criar o `FTS_DOC_ID_INDEX`, o `InnoDB` o criará automaticamente.

Antes do MySQL 5.7.13, o gap permitido entre o maior valor `FTS_DOC_ID` usado e o novo valor `FTS_DOC_ID` é 10000. No MySQL 5.7.13 e posterior, o gap permitido é 65535.

Para evitar o rebuild da tabela, a coluna `FTS_DOC_ID` é retida ao remover um full-text index.

##### InnoDB Full-Text Index Deletion Handling

A exclusão de um registro que possui uma coluna de full-text index pode resultar em inúmeras pequenas exclusões nas auxiliary index tables, tornando o acesso concorrente a essas tabelas um ponto de contenção. Para evitar este problema, o `DOC_ID` de um documento excluído é logado em uma tabela `FTS_*_DELETED` especial sempre que um registro é excluído de uma tabela indexada, e o registro indexado permanece no full-text index. Antes de retornar os resultados da Query, as informações na tabela `FTS_*_DELETED` são usadas para filtrar os `DOC_ID`s excluídos. O benefício deste design é que as exclusões são rápidas e de baixo custo. A desvantagem é que o tamanho do Index não é reduzido imediatamente após a exclusão dos registros. Para remover entradas de full-text index para registros excluídos, execute `OPTIMIZE TABLE` na tabela indexada com `innodb_optimize_fulltext_only=ON` para realizar o rebuild do full-text index. Para mais informações, consulte Otimizando InnoDB Full-Text Indexes.

##### InnoDB Full-Text Index Transaction Handling

Os full-text indexes do `InnoDB` possuem características especiais de transaction handling devido ao seu comportamento de caching e processamento em lote. Especificamente, as atualizações e inserções em um full-text index são processadas no momento do transaction commit, o que significa que uma full-text search só pode visualizar dados committed. O exemplo a seguir demonstra este comportamento. A full-text search só retorna um resultado depois que as linhas inseridas são committed.

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200),
       FULLTEXT idx (opening_line)
       ) ENGINE=InnoDB;

mysql> BEGIN;

mysql> INSERT INTO opening_lines(opening_line,author,title) VALUES
       ('Call me Ishmael.','Herman Melville','Moby-Dick'),
       ('A screaming comes across the sky.','Thomas Pynchon','Gravity\'s Rainbow'),
       ('I am an invisible man.','Ralph Ellison','Invisible Man'),
       ('Where now? Who now? When now?','Samuel Beckett','The Unnamable'),
       ('It was love at first sight.','Joseph Heller','Catch-22'),
       ('All this happened, more or less.','Kurt Vonnegut','Slaughterhouse-Five'),
       ('Mrs. Dalloway said she would buy the flowers herself.','Virginia Woolf','Mrs. Dalloway'),
       ('It was a pleasure to burn.','Ray Bradbury','Fahrenheit 451');

mysql> SELECT COUNT(*) FROM opening_lines WHERE MATCH(opening_line) AGAINST('Ishmael');
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+

mysql> COMMIT;

mysql> SELECT COUNT(*) FROM opening_lines WHERE MATCH(opening_line) AGAINST('Ishmael');
+----------+
| COUNT(*) |
+----------+
|        1 |
+----------+
```

##### Monitoring InnoDB Full-Text Indexes

Você pode monitorar e examinar os aspectos especiais de processamento de texto dos full-text indexes do `InnoDB` consultando as seguintes tabelas `INFORMATION_SCHEMA`:

* `INNODB_FT_CONFIG`
* `INNODB_FT_INDEX_TABLE`
* `INNODB_FT_INDEX_CACHE`
* `INNODB_FT_DEFAULT_STOPWORD`
* `INNODB_FT_DELETED`
* `INNODB_FT_BEING_DELETED`

Você também pode visualizar informações básicas para full-text indexes e tabelas consultando `INNODB_SYS_INDEXES` e `INNODB_SYS_TABLES`.

Para mais informações, consulte a Seção 14.16.4, “InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables”.