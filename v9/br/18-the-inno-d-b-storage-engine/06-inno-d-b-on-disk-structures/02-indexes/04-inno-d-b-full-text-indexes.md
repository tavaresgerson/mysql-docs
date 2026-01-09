#### 17.6.2.4 Índices de Texto Completo de InnoDB

Índices de texto completo são criados em colunas baseadas em texto (`CHAR`, `VARCHAR` ou colunas `TEXT`) para acelerar consultas e operações de DML nos dados contidos nessas colunas.

Um índice de texto completo é definido como parte de uma instrução `CREATE TABLE` ou adicionado a uma tabela existente usando `ALTER TABLE` ou `CREATE INDEX`.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() ... AGAINST`. Para informações de uso, consulte a Seção 14.9, “Funções de Busca de Texto Completo”.

Os índices de texto completo de `InnoDB` são descritos nos seguintes tópicos nesta seção:

* Projeto de Índices de Texto Completo de InnoDB
* Tabelas de Índices de Texto Completo de InnoDB
* Cache de Índices de Texto Completo de InnoDB
* Coluna `DOC_ID` e `FTS_DOC_ID` de Índices de Texto Completo de InnoDB
* Gerenciamento de Deleção de Índices de Texto Completo de InnoDB
* Gerenciamento de Transações de Índices de Texto Completo de InnoDB
* Monitoramento de Índices de Texto Completo de InnoDB

##### Projeto de Índices de Texto Completo de InnoDB

Os índices de texto completo de `InnoDB` têm um design de índice invertido. Índices invertidos armazenam uma lista de palavras e, para cada palavra, uma lista de documentos nos quais a palavra aparece. Para suportar a pesquisa de proximidade, informações de posição para cada palavra também são armazenadas, como um deslocamento de byte.

##### Tabelas de Índices de Texto Completo de InnoDB

Quando um índice de texto completo de `InnoDB` é criado, um conjunto de tabelas de índice é criado, conforme mostrado no exemplo seguinte:

```
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200),
       FULLTEXT idx (opening_line)
       ) ENGINE=InnoDB;

mysql> SELECT table_id, name, space from INFORMATION_SCHEMA.INNODB_TABLES
       WHERE name LIKE 'test/%';
+----------+----------------------------------------------------+-------+
| table_id | name                                               | space |
+----------+----------------------------------------------------+-------+
|      333 | test/fts_0000000000000147_00000000000001c9_index_1 |   289 |
|      334 | test/fts_0000000000000147_00000000000001c9_index_2 |   290 |
|      335 | test/fts_0000000000000147_00000000000001c9_index_3 |   291 |
|      336 | test/fts_0000000000000147_00000000000001c9_index_4 |   292 |
|      337 | test/fts_0000000000000147_00000000000001c9_index_5 |   293 |
|      338 | test/fts_0000000000000147_00000000000001c9_index_6 |   294 |
|      330 | test/fts_0000000000000147_being_deleted            |   286 |
|      331 | test/fts_0000000000000147_being_deleted_cache      |   287 |
|      332 | test/fts_0000000000000147_config                   |   288 |
|      328 | test/fts_0000000000000147_deleted                  |   284 |
|      329 | test/fts_0000000000000147_deleted_cache            |   285 |
|      327 | test/opening_lines                                 |   283 |
+----------+----------------------------------------------------+-------+
```

As seis primeiras tabelas de índice compreendem o índice invertido e são referenciadas como tabelas de índice auxiliares. Quando documentos recebidos são tokenizados, as palavras individuais (também referidas como “tokens”) são inseridas nas tabelas de índice junto com informações de posição e um `DOC_ID` associado. As palavras são totalmente ordenadas e particionadas entre as seis tabelas de índice com base no peso de classificação do primeiro caractere da palavra.

O índice invertido é dividido em seis tabelas de índice auxiliares para suportar a criação de índices de texto paralelos. Por padrão, dois threads tokenizam, classificam e inserem palavras e dados associados nas tabelas de índice. O número de threads que realizam esse trabalho é configurável usando a variável `innodb_ft_sort_pll_degree`. Considere aumentar o número de threads ao criar índices de texto completo em tabelas grandes.

Os nomes das tabelas de índice auxiliares são prefixados com `fts_` e pós-fixados com `index_#`. Cada tabela de índice auxiliar está associada à tabela indexada por um valor hexadecimal no nome da tabela de índice que corresponde ao `table_id` da tabela indexada. Por exemplo, o `table_id` da tabela `test/opening_lines` é `327`, para o qual o valor hexadecimal é 0x147. Como mostrado no exemplo anterior, o valor hexadecimal “147” aparece nos nomes das tabelas de índice auxiliares que estão associadas à tabela `test/opening_lines`.

Um valor hexadecimal representando o `index_id` do índice de texto também aparece nos nomes das tabelas de índice auxiliares. Por exemplo, no nome da tabela auxiliar `test/fts_0000000000000147_00000000000001c9_index_1`, o valor hexadecimal `1c9` tem um valor decimal de 457. O índice definido na tabela `opening_lines` (`idx`) pode ser identificado consultando a tabela do esquema de informações `INNODB_INDEXES` para esse valor (457).

```
mysql> SELECT index_id, name, table_id, space from INFORMATION_SCHEMA.INNODB_INDEXES
       WHERE index_id=457;
+----------+------+----------+-------+
| index_id | name | table_id | space |
+----------+------+----------+-------+
|      457 | idx  |      327 |   283 |
+----------+------+----------+-------+
```

As tabelas de índice são armazenadas em seus próprios espaços de tabela se a tabela principal for criada em um espaço de tabela por arquivo. Caso contrário, as tabelas de índice são armazenadas no espaço de tabela onde a tabela indexada reside.

As outras tabelas de índice mostradas no exemplo anterior são chamadas de tabelas de índice comuns e são usadas para lidar com a exclusão e armazenar o estado interno dos índices de texto completo. Ao contrário das tabelas de índice invertido, que são criadas para cada índice de texto completo, este conjunto de tabelas é comum a todos os índices de texto completo criados em uma tabela específica.

As tabelas de índice comuns são mantidas mesmo se os índices de texto completo forem excluídos. Quando um índice de texto completo é excluído, a coluna `FTS_DOC_ID` que foi criada para o índice é mantida, pois a remoção da coluna `FTS_DOC_ID` exigiria a reconstrução da tabela previamente indexada. As tabelas de índice comuns são necessárias para gerenciar a coluna `FTS_DOC_ID`.

* `fts_*_deleted` e `fts_*_deleted_cache`

  Contêm os IDs de documentos (DOC_ID) para documentos que são excluídos, mas cujos dados ainda não foram removidos do índice de texto completo. O `fts_*_deleted_cache` é a versão de memória da tabela `fts_*_deleted`.

* `fts_*_being_deleted` e `fts_*_being_deleted_cache`

  Contêm os IDs de documentos (DOC_ID) para documentos que são excluídos e cujos dados estão atualmente no processo de remoção do índice de texto completo. A tabela `fts_*_being_deleted_cache` é a versão de memória da tabela `fts_*_being_deleted`.

* `fts_*_config`

  Armazena informações sobre o estado interno do índice de texto completo. Mais importante, ele armazena o `FTS_SYNCED_DOC_ID`, que identifica documentos que foram analisados e descarregados no disco. Em caso de recuperação após falha, os valores de `FTS_SYNCED_DOC_ID` são usados para identificar documentos que não foram descarregados no disco, para que os documentos possam ser reanalizados e adicionados novamente ao cache do índice de texto completo. Para visualizar os dados nesta tabela, execute a consulta na tabela do Esquema de Informações `INNODB_FT_CONFIG`.

##### Cache de Índices de Texto Completo InnoDB

Quando um documento é inserido, ele é tokenizado, e as palavras individuais e os dados associados são inseridos no índice de texto completo. Esse processo, mesmo para documentos pequenos, pode resultar em inúmeras inserções pequenas nas tabelas de índice auxiliar. Isso torna o acesso concorrente a essas tabelas um ponto de conflito. Para evitar esse problema, o `InnoDB` usa um cache de índice de texto completo para armazenar temporariamente as inserções das tabelas de índice para as linhas inseridas recentemente. Essa estrutura de cache em memória armazena as inserções até que o cache esteja cheio e, então, as descarrega em lote no disco (para as tabelas de índice auxiliar). Você pode consultar a tabela do esquema de informações `INNODB_FT_INDEX_CACHE` para visualizar os dados tokenizados para as linhas inseridas recentemente.

O comportamento de cache e descarregamento em lote evita atualizações frequentes nas tabelas de índice auxiliar, o que poderia resultar em problemas de acesso concorrente durante os períodos de inserção e atualização ocupados. A técnica de lote também evita múltiplas inserções para a mesma palavra e minimiza entradas duplicadas. Em vez de descarregar cada palavra individualmente, as inserções para a mesma palavra são unidas e descarregadas no disco como uma única entrada, melhorando a eficiência da inserção enquanto mantém as tabelas de índice auxiliar o menores possíveis.

A variável `innodb_ft_cache_size` é usada para configurar o tamanho do cache de índice de texto completo (por tabela), o que afeta quantas vezes o cache de índice de texto completo é descarregado. Você também pode definir um limite global de tamanho de cache de índice de texto completo para todas as tabelas de uma instância específica usando a variável `innodb_ft_total_cache_size`.

O cache de índice de texto completo armazena as mesmas informações que as tabelas de índice auxiliares. No entanto, o cache de índice de texto completo armazena apenas dados tokenizados para linhas inseridas recentemente. Os dados que já foram descarregados no disco (para as tabelas de índice auxiliares) não são reintroduzidos no cache de índice de texto completo quando consultados. Os dados nas tabelas de índice auxiliares são consultados diretamente, e os resultados das tabelas de índice auxiliares são mesclados com os resultados do cache de índice de texto completo antes de serem retornados.

##### Índice de Texto Completo InnoDB DOC_ID e FTS_DOC_ID Coluna

O `InnoDB` usa um identificador de documento único, denominado `DOC_ID`, para mapear palavras no índice de texto completo a registros de documento onde a palavra aparece. A mapeo requer uma coluna `FTS_DOC_ID` na tabela indexada. Se uma coluna `FTS_DOC_ID` não for definida, o `InnoDB` adiciona automaticamente uma coluna oculta `FTS_DOC_ID` quando o índice de texto completo é criado. O exemplo a seguir demonstra esse comportamento.

A definição da tabela a seguir não inclui uma coluna `FTS_DOC_ID`:

```
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Quando você cria um índice de texto completo na tabela usando a sintaxe `CREATE FULLTEXT INDEX`, é exibido um aviso informando que o `InnoDB` está reconstruindo a tabela para adicionar a coluna `FTS_DOC_ID`.

```
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

O mesmo aviso é exibido quando você usa `ALTER TABLE` para adicionar um índice de texto completo a uma tabela que não tem uma coluna `FTS_DOC_ID`. Se você criar um índice de texto completo no momento da criação da tabela e não especificar uma coluna `FTS_DOC_ID`, o `InnoDB` adiciona uma coluna oculta `FTS_DOC_ID`, sem aviso.

Definir uma coluna `FTS_DOC_ID` no momento da criação da tabela com `CREATE TABLE` é menos caro do que criar um índice de texto completo em uma tabela que já está carregada com dados. Se uma coluna `FTS_DOC_ID` for definida em uma tabela antes de carregar dados, a tabela e seus índices não precisam ser reconstruídos para adicionar a nova coluna. Se você não se preocupa com o desempenho do `CREATE FULLTEXT INDEX`, deixe a coluna `FTS_DOC_ID` de fora para que o `InnoDB` a crie para você. O `InnoDB` cria uma coluna `FTS_DOC_ID` oculta junto com um índice único (`FTS_DOC_ID_INDEX`) na coluna `FTS_DOC_ID`. Se você quiser criar sua própria coluna `FTS_DOC_ID`, a coluna deve ser definida como `BIGINT UNSIGNED NOT NULL` e nomeada `FTS_DOC_ID` (todas maiúsculas), como no exemplo a seguir:

Observação

A coluna `FTS_DOC_ID` não precisa ser definida como uma coluna `AUTO_INCREMENT`, mas fazer isso poderia facilitar o carregamento de dados.

```
mysql> CREATE TABLE opening_lines (
       FTS_DOC_ID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Se você optar por definir a coluna `FTS_DOC_ID` você mesmo, você é responsável por gerenciar a coluna para evitar valores vazios ou duplicados. Os valores de `FTS_DOC_ID` não podem ser reutilizados, o que significa que os valores de `FTS_DOC_ID` devem ser sempre crescentes.

Opcionalmente, você pode criar o índice único necessário `FTS_DOC_ID_INDEX` (todas maiúsculas) na coluna `FTS_DOC_ID`.

```
mysql> CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on opening_lines(FTS_DOC_ID);
```

Se você não criar o `FTS_DOC_ID_INDEX`, o `InnoDB` cria automaticamente.

Observação

`FTS_DOC_ID_INDEX` não pode ser definido como um índice descendente porque o analisador de SQL do `InnoDB` não usa índices descendentes.

O intervalo permitido entre o maior valor usado de `FTS_DOC_ID` e o novo valor de `FTS_DOC_ID` é de 65535.

Para evitar a reconstrução da tabela, a coluna `FTS_DOC_ID` é mantida ao excluir um índice de texto completo.

##### Gerenciamento da Exclusão de Índices de Texto Completo do InnoDB

A exclusão de um registro que possui uma coluna de índice de texto completo pode resultar em inúmeras exclusões pequenas nas tabelas de índice auxiliar, tornando o acesso concorrente a essas tabelas um ponto de conflito. Para evitar esse problema, o `DOC_ID` de um documento excluído é registrado em uma tabela especial `FTS_*_DELETED` sempre que um registro é excluído de uma tabela indexada, e o registro indexado permanece no índice de texto completo. Antes de retornar os resultados da consulta, as informações na tabela `FTS_*_DELETED` são usadas para filtrar os `DOC_ID`s excluídos. O benefício desse design é que as exclusões são rápidas e econômicas. A desvantagem é que o tamanho do índice não é reduzido imediatamente após a exclusão de registros. Para remover entradas do índice de texto completo para registros excluídos, execute `OPTIMIZE TABLE` na tabela indexada com `innodb_optimize_fulltext_only=ON` para reconstruir o índice de texto completo. Para mais informações, consulte Otimizando Indekses de Texto Completo InnoDB.

##### Gerenciamento de Transações de Índices de Texto Completo de `InnoDB`

Os índices de texto completo de `InnoDB` têm características especiais de gerenciamento de transações devido ao seu comportamento de cache e processamento em lote. Especificamente, as atualizações e inserções em um índice de texto completo são processadas no momento do commit da transação, o que significa que uma pesquisa de texto completo só pode ver dados comprometidos. O exemplo seguinte demonstra esse comportamento. A pesquisa de texto completo só retorna um resultado após as linhas inseridas serem comprometidas.

```
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

mysql> SELECT COUNT(*) FROM opening_lines
    -> WHERE MATCH(opening_line) AGAINST('Ishmael');
+----------+
| COUNT(*) |
+----------+
|        1 |
+----------+
```

##### Monitoramento de Índices de Texto Completo de `InnoDB`

Você pode monitorar e examinar os aspectos especiais de processamento de texto dos índices de texto completo de `InnoDB` consultando as seguintes tabelas do `INFORMATION_SCHEMA`:

* `INNODB_FT_CONFIG`
* `INNODB_FT_INDEX_TABLE`
* `INNODB_FT_INDEX_CACHE`
* `INNODB_FT_DEFAULT_STOPWORD`
* `INNODB_FT_DELETED`
* `INNODB_FT_BEING_DELETED`

Você também pode visualizar informações básicas sobre índices de texto completo e tabelas consultando `INNODB_INDEXES` e `INNODB_TABLES`.

Para mais informações, consulte a Seção 17.15.4, “Tabelas de Índices FULLTEXT do Schema de Informações InnoDB”.