#### 14.6.2.4 Índices de Texto Completo InnoDB

Os índices de texto completo são criados em colunas baseadas em texto (colunas `CHAR`, `VARCHAR` ou `TEXT`) para acelerar as consultas e as operações de manipulação de dados (DML) nos dados contidos nessas colunas.

Um índice de texto completo é definido como parte de uma instrução `CREATE TABLE` ou adicionado a uma tabela existente usando `ALTER TABLE` ou `CREATE INDEX`.

A pesquisa de texto completo é realizada usando a sintaxe `MATCH() ... AGAINST`. Para informações sobre o uso, consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

Os índices de texto completo do InnoDB são descritos nos tópicos a seguir nesta seção:

- Design de índice de texto completo InnoDB
- Tabelas de índice de texto completo InnoDB
- Cache de índice de texto completo InnoDB
- Índice de Texto Completo InnoDB DOC\_ID e Coluna FTS\_DOC\_ID
- Tratamento da exclusão de índices de texto completo do InnoDB
- Tratamento de transações de índice de texto completo InnoDB
- Monitoramento de índices de texto completo InnoDB

##### Design de índice de texto completo InnoDB

Os índices de texto completo do `InnoDB` têm um design de índice invertido. Os índices invertidos armazenam uma lista de palavras e, para cada palavra, uma lista de documentos nos quais a palavra aparece. Para suportar a pesquisa por proximidade, as informações de posição de cada palavra também são armazenadas, como um deslocamento em bytes.

##### Tabelas de índice de texto completo InnoDB

Quando um índice de texto completo `InnoDB` é criado, um conjunto de tabelas de índice é criado, conforme mostrado no exemplo a seguir:

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

As seis primeiras tabelas de índice compõem o índice invertido e são referidas como tabelas de índice auxiliares. Quando os documentos recebidos são tokenizados, as palavras individuais (também chamadas de “tokens”) são inseridas nas tabelas de índice juntamente com informações de posição e um `DOC_ID` associado. As palavras são totalmente ordenadas e divididas entre as seis tabelas de índice com base no peso de classificação do conjunto de caracteres do primeiro caractere da palavra.

O índice invertido é dividido em seis tabelas de índice auxiliares para suportar a criação de índices paralelos. Por padrão, dois threads tokenizam, classificam e inserem palavras e dados associados nas tabelas de índice. O número de threads que realizam esse trabalho é configurável usando a variável `innodb_ft_sort_pll_degree`. Considere aumentar o número de threads ao criar índices de texto completo em tabelas grandes.

Os nomes das tabelas de índice auxiliares são prefixados com `fts_` e pós-fixados com `index_#`. Cada tabela de índice auxiliar está associada à tabela indexada por um valor hexadecimal no nome da tabela de índice auxiliar que corresponde ao `table_id` da tabela indexada. Por exemplo, o `table_id` da tabela `test/opening_lines` é `327`, para o qual o valor hexadecimal é 0x147. Como mostrado no exemplo anterior, o valor hexadecimal “147” aparece nos nomes das tabelas de índice auxiliares que estão associadas à tabela `test/opening_lines`.

Um valor hexadecimal que representa o `index_id` do índice de texto completo também aparece nos nomes das tabelas de índice auxiliares. Por exemplo, no nome da tabela auxiliar `test/FTS_0000000000000147_00000000000001c9_INDEX_1`, o valor hexadecimal `1c9` tem um valor decimal de 457. O índice definido na tabela `opening_lines` (`idx`) pode ser identificado consultando a tabela do Schema de Informações `INNODB_SYS_INDEXES` para este valor (457).

```sql
mysql> SELECT index_id, name, table_id, space from INFORMATION_SCHEMA.INNODB_SYS_INDEXES
       WHERE index_id=457;
+----------+------+----------+-------+
| index_id | name | table_id | space |
+----------+------+----------+-------+
|      457 | idx  |      327 |   283 |
+----------+------+----------+-------+
```

As tabelas de índice são armazenadas em seu próprio espaço de tabela se a tabela principal for criada em um espaço de tabela por arquivo. Caso contrário, as tabelas de índice são armazenadas no espaço de tabela onde a tabela indexada reside.

As outras tabelas de índice mostradas no exemplo anterior são chamadas de tabelas de índice comuns e são usadas para lidar com a exclusão e armazenar o estado interno dos índices de texto completo. Ao contrário das tabelas de índice invertido, que são criadas para cada índice de texto completo, este conjunto de tabelas é comum a todos os índices de texto completo criados em uma tabela específica.

As tabelas de índice comuns são mantidas mesmo se os índices de texto completo forem removidos. Quando um índice de texto completo é removido, a coluna `FTS_DOC_ID` que foi criada para o índice é mantida, pois a remoção da coluna `FTS_DOC_ID` exigiria a reconstrução da tabela previamente indexada. As tabelas de índice comuns são necessárias para gerenciar a coluna `FTS_DOC_ID`.

- `FTS_*_DELETED` e `FTS_*_DELETED_CACHE`

  Contêm os IDs de documentos (DOC\_ID) para documentos que são excluídos, mas cujos dados ainda não foram removidos do índice de texto completo. O `FTS_*_DELETED_CACHE` é a versão de memória da tabela `FTS_*_DELETED`.

- `FTS_*_BEING_DELETED` e `FTS_*_BEING_DELETED_CACHE`

  Contêm os IDs dos documentos (DOC\_ID) para documentos que são excluídos e cujos dados estão atualmente sendo removidos do índice de texto completo. A tabela `FTS_*_BEING_DELETED_CACHE` é a versão de memória da tabela `FTS_*_BEING_DELETED`.

- `FTS_*_CONFIG`

  Armazena informações sobre o estado interno do índice de texto completo. O mais importante é que ele armazena o `FTS_SYNCED_DOC_ID`, que identifica documentos que foram analisados e descarregados no disco. Em caso de recuperação após falha, os valores de `FTS_SYNCED_DOC_ID` são usados para identificar documentos que não foram descarregados no disco, para que os documentos possam ser analisados novamente e adicionados de volta ao cache do índice de texto completo. Para visualizar os dados nesta tabela, consulte a tabela do esquema de informações `INNODB_FT_CONFIG`.

##### Cache de índice de texto completo InnoDB

Quando um documento é inserido, ele é tokenizado e as palavras individuais e os dados associados são inseridos no índice de texto completo. Esse processo, mesmo para documentos pequenos, pode resultar em inúmeras inserções pequenas nas tabelas de índice auxiliares, tornando o acesso concorrente a essas tabelas um ponto de conflito. Para evitar esse problema, o `InnoDB` usa um cache de índice de texto completo para armazenar temporariamente as inserções das tabelas de índice para linhas inseridas recentemente. Essa estrutura de cache em memória armazena as inserções até que o cache esteja cheio e, então, as descarrega em lote no disco (para as tabelas de índice auxiliares). Você pode consultar a tabela do esquema de informações `INNODB_FT_INDEX_CACHE` para visualizar os dados tokenizados para linhas inseridas recentemente.

O comportamento de cache e varredura em lote evita atualizações frequentes em tabelas de índice auxiliares, o que poderia resultar em problemas de acesso concorrente durante períodos de inserção e atualização intensos. A técnica de agrupamento também evita múltiplas inserções para a mesma palavra e minimiza entradas duplicadas. Em vez de varrer cada palavra individualmente, as inserções para a mesma palavra são unidas e varridas para o disco como uma única entrada, melhorando a eficiência da inserção enquanto mantém as tabelas de índice auxiliares o menores possíveis.

A variável `innodb_ft_cache_size` é usada para configurar o tamanho do cache do índice de texto completo (por tabela), o que afeta a frequência com que o cache do índice de texto completo é esvaziado. Você também pode definir um limite global de tamanho do cache de índice de texto completo para todas as tabelas em uma instância específica usando a variável `innodb_ft_total_cache_size`.

O cache do índice de texto completo armazena as mesmas informações que as tabelas de índice auxiliares. No entanto, o cache do índice de texto completo armazena apenas dados tokenizados para linhas inseridas recentemente. Os dados que já foram descarregados no disco (para as tabelas de índice auxiliares) não são trazidos de volta para o cache do índice de texto completo quando a consulta é realizada. Os dados nas tabelas de índice auxiliares são consultados diretamente, e os resultados das tabelas de índice auxiliares são mesclados com os resultados do cache do índice de texto completo antes de serem retornados.

##### Índice de Texto Completo InnoDB DOC\_ID e Coluna FTS\_DOC\_ID

O `InnoDB` usa um identificador único de documento, denominado `DOC_ID`, para mapear palavras no índice de texto completo para registros de documentos onde a palavra aparece. A mapeo requer uma coluna `FTS_DOC_ID` na tabela indexada. Se uma coluna `FTS_DOC_ID` não for definida, o `InnoDB` adiciona automaticamente uma coluna `FTS_DOC_ID` oculta quando o índice de texto completo é criado. O exemplo a seguir demonstra esse comportamento.

A definição da tabela a seguir não inclui uma coluna `FTS_DOC_ID`:

```sql
mysql> CREATE TABLE opening_lines (
       id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Quando você cria um índice de texto completo na tabela usando a sintaxe `CREATE FULLTEXT INDEX`, um aviso é exibido, informando que o `InnoDB` está reconstruindo a tabela para adicionar a coluna `FTS_DOC_ID`.

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

O mesmo aviso é retornado quando você usa `ALTER TABLE` para adicionar um índice de texto completo a uma tabela que não tem uma coluna `FTS_DOC_ID`. Se você criar um índice de texto completo no momento da criação da tabela e não especificar uma coluna `FTS_DOC_ID`, o `InnoDB` adiciona uma coluna `FTS_DOC_ID` oculta, sem aviso.

Definir uma coluna `FTS_DOC_ID` no momento da criação da tabela com `CREATE TABLE` é mais barato do que criar um índice de texto completo em uma tabela que já está carregada com dados. Se uma coluna `FTS_DOC_ID` for definida em uma tabela antes da carga de dados, a tabela e seus índices não precisam ser reconstruídos para adicionar a nova coluna. Se você não se preocupa com o desempenho do `CREATE FULLTEXT INDEX`, deixe a coluna `FTS_DOC_ID` de fora para que o `InnoDB` a crie para você. O `InnoDB` cria uma coluna `FTS_DOC_ID` oculta, juntamente com um índice único (`FTS_DOC_ID_INDEX`) na coluna `FTS_DOC_ID`. Se você quiser criar sua própria coluna `FTS_DOC_ID`, a coluna deve ser definida como `BIGINT UNSIGNED NOT NULL` e nomeada `FTS_DOC_ID` (todos maiúsculos), como no exemplo a seguir:

Nota

A coluna `FTS_DOC_ID` não precisa ser definida como uma coluna `AUTO_INCREMENT`, mas isso pode facilitar o carregamento dos dados.

```sql
mysql> CREATE TABLE opening_lines (
       FTS_DOC_ID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
       opening_line TEXT(500),
       author VARCHAR(200),
       title VARCHAR(200)
       ) ENGINE=InnoDB;
```

Se você optar por definir a coluna `FTS_DOC_ID` manualmente, você será responsável por gerenciá-la para evitar valores vazios ou duplicados. Os valores de `FTS_DOC_ID` não podem ser reutilizados, o que significa que os valores de `FTS_DOC_ID` devem ser sempre crescentes.

Opcionalmente, você pode criar o `FTS_DOC_ID_INDEX` único necessário (todos em maiúsculas) na coluna `FTS_DOC_ID`.

```sql
mysql> CREATE UNIQUE INDEX FTS_DOC_ID_INDEX on opening_lines(FTS_DOC_ID);
```

Se você não criar o `FTS_DOC_ID_INDEX`, o `InnoDB` cria automaticamente.

Antes do MySQL 5.7.13, a diferença permitida entre o maior valor usado do `FTS_DOC_ID` e o novo valor `FTS_DOC_ID` era de 10000. No MySQL 5.7.13 e versões posteriores, a diferença permitida é de 65535.

Para evitar a reconstrução da tabela, a coluna `FTS_DOC_ID` é mantida ao excluir um índice de texto completo.

##### Tratamento da exclusão de índices de texto completo do InnoDB

A exclusão de um registro que possui uma coluna de índice de texto completo pode resultar em inúmeras exclusões pequenas nas tabelas de índice auxiliar, tornando o acesso concorrente a essas tabelas um ponto de conflito. Para evitar esse problema, o `DOC_ID` de um documento excluído é registrado em uma tabela especial `FTS_*_DELETED` sempre que um registro é excluído de uma tabela indexada, e o registro indexado permanece no índice de texto completo. Antes de retornar os resultados da consulta, as informações na tabela `FTS_*_DELETED` são usadas para filtrar os `DOC_ID`s excluídos. O benefício desse design é que as exclusões são rápidas e econômicas. A desvantagem é que o tamanho do índice não é reduzido imediatamente após a exclusão de registros. Para remover entradas do índice de texto completo para registros excluídos, execute `OPTIMIZE TABLE` na tabela indexada com `innodb_optimize_fulltext_only=ON` para reconstruir o índice de texto completo. Para mais informações, consulte Otimizando índices de texto completo InnoDB.

##### Tratamento de transações de índice de texto completo InnoDB

Os índices de texto completo do `InnoDB` têm características especiais de tratamento de transações devido ao seu comportamento de cache e processamento em lote. Especificamente, as atualizações e inserções em um índice de texto completo são processadas no momento do commit da transação, o que significa que uma pesquisa de texto completo só pode ver dados comprometidos. O exemplo a seguir demonstra esse comportamento. A pesquisa de texto completo só retorna um resultado após as linhas inseridas serem comprometidas.

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

##### Monitoramento de índices de texto completo InnoDB

Você pode monitorar e examinar os aspectos especiais de processamento de texto dos índices full-text do `InnoDB` consultando as seguintes tabelas do `INFORMATION_SCHEMA`:

- `INNODB_FT_CONFIG`
- `INNODB_FT_INDEX_TABLE`
- `INNODB_FT_INDEX_CACHE`
- `INNODB_FT_DEFAULT_STOPWORD`
- `INNODB_FT_DELETED`
- `INNODB_FT_BEING_DELETED`

Você também pode visualizar informações básicas sobre índices de texto completo e tabelas fazendo uma consulta no `INNODB_SYS_INDEXES` e `INNODB_SYS_TABLES`.

Para obter mais informações, consulte a Seção 14.16.4, “Tabelas de Índices FULLTEXT do InnoDB INFORMATION\_SCHEMA”.
