## 17.12 InnoDB e DDL Online

O recurso DDL online oferece suporte para alterações instantâneas e em local de tabela e DML concorrente. Os benefícios desse recurso incluem:

* Melhor resposta e disponibilidade em ambientes de produção ocupados, onde deixar uma tabela indisponível por minutos ou horas não é prático.

* Para operações em local, a capacidade de ajustar o equilíbrio entre desempenho e concorrência durante operações de DDL usando a cláusula `LOCK`. Veja a cláusula LOCK.

* Menos espaço em disco e sobrecarga de I/O do que o método de cópia de tabela.

Nota

O suporte `ALGORITHM=INSTANT` está disponível para `ADD COLUMN` e outras operações no MySQL 8.0.12.

Normalmente, você não precisa fazer nada de especial para habilitar o DDL online. Por padrão, o MySQL executa a operação instantaneamente ou no local, conforme permitido, com o menor bloqueio possível.

Você pode controlar aspectos de uma operação de DDL usando as cláusulas `ALGORITHM` e `LOCK` da declaração `ALTER TABLE`. Essas cláusulas são colocadas no final da declaração, separadas das especificações de tabela e coluna por vírgulas. Por exemplo:

```
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE;
```

A cláusula `LOCK` pode ser usada para operações que são realizadas in loco e é útil para ajustar o grau de acesso concorrente à tabela durante as operações. Apenas a cláusula `LOCK=DEFAULT` é suportada para operações que são realizadas instantaneamente. A cláusula `ALGORITHM` é destinada principalmente para comparações de desempenho e como uma solução de fallback para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

* Para evitar que a tabela seja indisponível para leituras, escritas ou ambas, durante uma operação de `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") in-place, especifique uma cláusula na declaração `ALTER TABLE`, como `LOCK=NONE` (permite leituras e escritas) ou `LOCK=SHARED` (permite leituras). A operação pára imediatamente se o nível de concorrência solicitado não estiver disponível.

* Para comparar o desempenho entre os algoritmos, execute uma declaração com `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Você também pode executar uma declaração com a opção de configuração `old_alter_table` habilitada para forçar o uso de `ALGORITHM=COPY`.

* Para evitar sobrecarregar o servidor com uma operação `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") que copia a tabela, inclua `ALGORITHM=INSTANT` ou `ALGORITHM=INPLACE`. A declaração pára imediatamente se não puder usar o algoritmo especificado.

### 17.12.1 Operações de DDL Online

Detalhes de suporte online, exemplos de sintaxe e notas de uso para operações DDL são fornecidos nos seguintes tópicos nesta seção.

* Operações de índice
* Operações de chave primária
* Operações de coluna
* Operações de coluna gerada
* Operações de chave estrangeira
* Operações de tabela
* Operações de tablespace
* Operações de particionamento

#### Operações de Índice

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de índice. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.16 Suporte de DDL online para operações de índice**

<table summary="Online DDL support for index operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Creating or adding a secondary index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Dropping an index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Renaming an index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Adding a <code>FULLTEXT</code> index</th> <td>No</td> <td>Yes*</td> <td>No*</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Adding a <code>SPATIAL</code> index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Changing the index type</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Criar ou adicionar um índice secundário

  ```
  CREATE INDEX name ON table (col_list);
  ```

  ```
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo criado. A declaração `CREATE INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que, geralmente, você pode acelerar o processo geral de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando índices secundários após o carregamento dos dados.

Um índice secundário recém-criado contém apenas os dados comprometidos na tabela no momento em que a declaração `CREATE INDEX` ou `ALTER TABLE` termina a execução. Não contém quaisquer valores não comprometidos, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do índice antigo.

Alguns fatores afetam o desempenho, o uso do espaço e a semântica dessa operação. Para obter detalhes, consulte a Seção 17.12.8, “Limitações do DDL online”.

* A queda de um índice

  ```
  DROP INDEX name ON table;
  ```

  ```
  ALTER TABLE tbl_name DROP INDEX name;
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo descartado. A declaração `DROP INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

* Renomear um índice

  ```
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adicionando um índice `FULLTEXT`

  ```
  CREATE FULLTEXT INDEX name ON table(column);
  ```

A adição do primeiro índice `FULLTEXT` reconstrui a tabela se não houver uma coluna definida pelo usuário `FTS_DOC_ID`. Índices adicionais `FULLTEXT` podem ser adicionados sem a necessidade de reconstruir a tabela.

* Adicionando um índice `SPATIAL`

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Alterar o tipo de índice (`USING {BTREE | HASH}`)

  ```
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INSTANT;
  ```

#### Operações de Chave Primária

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave primária. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Consulte as Notas de sintaxe e uso.

**Tabela 17.17 Suporte de DDL online para operações de chave primária**

<table summary="Online DDL support for primary key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Adding a primary key</th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Dropping a primary key</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Dropping a primary key and adding another</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionar uma chave primária

  ```
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara. `ALGORITHM=INPLACE` não é permitido sob certas condições, se as colunas tiverem que ser convertidas em `NOT NULL`.

A reestruturação do índice agrupado sempre requer a cópia dos dados da tabela. Portanto, é melhor definir a chave primária (glossary.html#glos_primary_key "primary key") ao criar uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` mais tarde.

Quando você cria um índice `UNIQUE` ou `PRIMARY KEY`, o MySQL deve realizar algum trabalho adicional. Para índices de `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a chave. Para um índice de `PRIMARY KEY`, o MySQL também verifica que nenhuma das colunas de `PRIMARY KEY` contenha um `NULL`.

Quando você adiciona uma chave primária usando a cláusula `ALGORITHM=COPY`, o MySQL converte os valores `NULL` nas colunas associadas em valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Esse é um comportamento não padrão que a Oracle recomenda que você não confie. Adicionar uma chave primária usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui as bandeiras `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é estrita, `ALGORITHM=INPLACE` é permitido, mas a declaração ainda pode falhar se as colunas da chave primária solicitadas contiverem valores `NULL`. O comportamento `ALGORITHM=INPLACE` é mais compatível com o padrão.

Se você criar uma tabela sem uma chave primária, `InnoDB` escolhe uma para você, que pode ser a primeira chave `UNIQUE` definida nas colunas de `NOT NULL`, ou uma chave gerada pelo sistema. Para evitar a incerteza e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da declaração `CREATE TABLE`.

O MySQL cria um novo índice agrupado copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de índice desejada. Uma vez que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome diferente para a tabela temporária. A tabela temporária que compreende o novo índice agrupado é renomeada com o nome da tabela original, e a tabela original é eliminada do banco de dados.

As melhorias de desempenho online que se aplicam às operações em índices secundários não se aplicam ao índice da chave primária. As linhas de uma tabela InnoDB são armazenadas em um índice agrupado organizado com base na chave primária, formando o que alguns sistemas de banco de dados chamam de "tabela organizada por índice". Como a estrutura da tabela está intimamente ligada à chave primária, redefinir a chave primária ainda requer a cópia dos dados.

Quando uma operação na chave primária usa `ALGORITHM=INPLACE`, mesmo que os dados ainda sejam copiados, é mais eficiente do que usar `ALGORITHM=COPY`, porque:

+ Não é necessário registro de desfazer ou registro de correção associado para `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às declarações DDL que utilizam `ALGORITHM=COPY`.

+ As entradas do índice secundário estão pré-ordenadas e, portanto, podem ser carregadas em ordem.

+ O buffer de alteração não é usado, porque não há inserções de acesso aleatório nos índices secundários.

* Deixar uma chave primária

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

Apenas `ALGORITHM=COPY` permite a eliminação de uma chave primária sem a adição de uma nova chave na mesma declaração `ALTER TABLE`.

* Remover uma chave primária e adicionar outra

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

#### Operações de Coluna

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.18 Suporte de DDL online para operações de coluna**

<table summary="Online DDL support for column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Adding a column</th> <td>Yes*</td> <td>Yes</td> <td>No*</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th scope="row">Dropping a column</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Renaming a column</th> <td>Yes*</td> <td>Yes</td> <td>No</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th scope="row">Reordering columns</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Setting a column default value</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Changing the column data type</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Extending <code>VARCHAR</code> column size</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Dropping the column default value</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Changing the auto-increment value</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No*</td> </tr><tr> <th scope="row">Making a column <code>NULL</code></th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Making a column <code>NOT NULL</code></th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Modifying the definition of an <code>ENUM</code> or <code>SET</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma coluna

  ```
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INSTANT;
  ```

`INSTANT` é o algoritmo padrão a partir do MySQL 8.0.12 e `INPLACE` antes disso.

As seguintes limitações se aplicam quando o algoritmo `INSTANT` adiciona uma coluna:

+ Uma declaração não pode combinar a adição de uma coluna com outras ações `ALTER TABLE` que não suportam o algoritmo `INSTANT`.

+ O algoritmo `INSTANT` pode adicionar uma coluna em qualquer posição na tabela. Antes do MySQL 8.0.29, o algoritmo `INSTANT` só podia adicionar uma coluna como a última coluna da tabela.

+ Colunas não podem ser adicionadas a tabelas que utilizam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. As tabelas temporárias só suportam `ALGORITHM=COPY`.

+ O MySQL verifica o tamanho da linha quando o algoritmo `INSTANT` adiciona uma coluna e lança o seguinte erro se a adição exceder o limite.

ERRO 4092 (HY000): A coluna não pode ser adicionada com ALGORITMO=INSTANT, pois, após isso, o tamanho máximo possível da linha excede o tamanho máximo permitido. Tente ALGORITMO=INPLACE/COPY.

Antes do MySQL 8.0.29, o MySQL não verifica o tamanho da linha quando o algoritmo `INSTANT` adiciona uma coluna. No entanto, o MySQL verifica o tamanho da linha durante as operações DML que inserem e atualizam linhas na tabela.

+ O número máximo de colunas na representação interna da tabela não pode exceder 1022 após a adição de colunas com o algoritmo `INSTANT`. A mensagem de erro é:

ERRO 4158 (HY000): A coluna não pode ser adicionada a *`tbl_name`* com ALGORITHM=INSTANT. Tente ALGORITHM=INPLACE/COPY

+ O algoritmo `INSTANT` não pode adicionar ou excluir colunas em tabelas do esquema do sistema, como a tabela interna `mysql`. Essa limitação foi adicionada no MySQL 8.0.29.

+ Uma coluna com um índice funcional não pode ser excluída usando o algoritmo `INSTANT`.

Várias colunas podem ser adicionadas na mesma declaração `ALTER TABLE`. Por exemplo:

  ```
  ALTER TABLE t1 ADD COLUMN c2 INT, ADD COLUMN c3 INT, ALGORITHM=INSTANT;
  ```

Uma nova versão da linha é criada após cada operação `ALTER TABLE ... ALGORITHM=INSTANT`(alter-table.html "15.1.9 ALTER TABLE Statement"), que adiciona uma ou mais colunas, exclui uma ou mais colunas ou adiciona e exclui uma ou mais colunas na mesma operação. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` acompanha o número de versões da linha para uma tabela. O valor é incrementado cada vez que uma coluna é adicionada ou excluída instantaneamente. O valor inicial é 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

Quando uma tabela com colunas adicionadas ou excluídas instantaneamente é reconstruída pela operação de reconstrução de tabela `ALTER TABLE` ou `OPTIMIZE TABLE`, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões de linha permitidas é de 64, pois cada versão de linha requer espaço adicional para metadados da tabela. Quando o limite de versões de linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` usando `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

ERRO 4092 (HY000): Versões máximas de linha alcançadas para a tabela test/t1. Não é possível adicionar ou descartar colunas instantaneamente. Use COPIE/LOCAL.

As seguintes colunas `INFORMATION_SCHEMA` fornecem metadados adicionais para colunas adicionadas instantaneamente. Consulte as descrições dessas colunas para obter mais informações. Veja a Seção 28.4.9, “A tabela INFORMATION_SCHEMA INNODB_COLUMNS”, e a Seção 28.4.23, “A tabela INFORMATION_SCHEMA INNODB_TABLES”.

+ `INNODB_COLUMNS.DEFAULT_VALUE`
  + `INNODB_COLUMNS.HAS_DEFAULT`
  + `INNODB_TABLES.INSTANT_COLS`

A DML concorrente não é permitida ao adicionar uma coluna de autoincremento. Os dados são reorganizados substancialmente, tornando-se uma operação cara. No mínimo, é necessário `ALGORITHM=INPLACE, LOCK=SHARED`.

A tabela é reconstruída se `ALGORITHM=INPLACE` for usado para adicionar uma coluna.

* Deixar uma coluna

  ```
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INSTANT;
  ```

`INSTANT` é o algoritmo padrão a partir do MySQL 8.0.29 e `INPLACE` antes disso.

As seguintes limitações se aplicam quando o algoritmo `INSTANT` é usado para descartar uma coluna:

+ A eliminação de uma coluna não pode ser combinada na mesma declaração com outras ações `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") que não suportam `ALGORITHM=INSTANT`.

+ Colunas não podem ser excluídas de tabelas que utilizam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. As tabelas temporárias só suportam `ALGORITHM=COPY`.

Várias colunas podem ser excluídas na mesma declaração `ALTER TABLE`; por exemplo:

  ```
  ALTER TABLE t1 DROP COLUMN c4, DROP COLUMN c5, ALGORITHM=INSTANT;
  ```

Cada vez que uma coluna é adicionada ou removida usando `ALGORITHM=INSTANT`, uma nova versão da linha é criada. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` acompanha o número de versões da linha para uma tabela. O valor é incrementado cada vez que uma coluna é adicionada ou removida instantaneamente. O valor inicial é 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

Quando uma tabela com colunas adicionadas ou excluídas instantaneamente é reconstruída pela operação de reconstrução de tabela `ALTER TABLE` ou `OPTIMIZE TABLE`, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões de linha permitidas é de 64, pois cada versão de linha requer espaço adicional para metadados da tabela. Quando o limite de versão de linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` usando `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

ERRO 4092 (HY000): Versões máximas de linha alcançadas para a tabela test/t1. Não é possível adicionar ou descartar colunas instantaneamente. Use COPIE/LOCAL.

Se um algoritmo diferente de `ALGORITHM=INSTANT` for utilizado, os dados são reorganizados de forma substancial, tornando-se uma operação cara.

* Renomear uma coluna

  ```
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INSTANT;
  ```

O suporte `ALGORITHM=INSTANT` para renomear uma coluna foi adicionado no MySQL 8.0.28. Releases anteriores do MySQL Server só suportam `ALGORITHM=INPLACE` e `ALGORITHM=COPY` ao renomear uma coluna.

Para permitir DML concorrente, mantenha o mesmo tipo de dados e altere apenas o nome da coluna.

Quando você mantém o mesmo tipo de dados e o atributo `[NOT] NULL`, apenas alterando o nome da coluna, a operação sempre pode ser realizada online.

Renomear uma coluna referenciada de outra tabela só é permitido com `ALGORITHM=INPLACE`. Se você usar `ALGORITHM=INSTANT`, `ALGORITHM=COPY` ou alguma outra condição que faça com que a operação use esses algoritmos, a declaração `ALTER TABLE` falha.

`ALGORITHM=INSTANT` suporta o renomeamento de uma coluna virtual; `ALGORITHM=INPLACE`

`ALGORITHM=INSTANT` e `ALGORITHM=INPLACE` não suportam renomear uma coluna ao adicionar ou remover uma coluna virtual na mesma declaração. Nesse caso, apenas `ALGORITHM=COPY` é suportado.

* Reordenar colunas

Para reordenar as colunas, use `FIRST` ou `AFTER` nas operações de `CHANGE` ou `MODIFY`.

  ```
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

* Alterar o tipo de dados da coluna

  ```
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

A alteração do tipo de dados da coluna só é suportada com `ALGORITHM=COPY`.

* Ampliar o tamanho da coluna `VARCHAR`

  ```
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

O número de bytes de comprimento necessários para uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` com tamanho de 0 a 255 bytes, é necessário um byte de comprimento para codificar o valor. Para colunas `VARCHAR` com tamanho de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, o `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de um único byte de VARCHAR(255) para VARCHAR(256) usando o `ALTER TABLE` in-place (alter-table.html "15.1.9 ALTER TABLE Statement") retorna este erro:

  ```
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

Nota

O comprimento de byte de uma coluna `VARCHAR` depende do comprimento de byte do conjunto de caracteres.

A redução do tamanho de `VARCHAR` usando `ALTER TABLE` em local é não suportada. A redução do tamanho de `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

* Definir um valor padrão para uma coluna

  ```
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INSTANT;
  ```

Modifica apenas os metadados da tabela. Os valores padrão das colunas são armazenados no dicionário de dados [(glossary.html#glos_data_dictionary "data dictionary")].

* Deixar um valor padrão de coluna em branco

  ```
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INSTANT;
  ```

* Alterar o valor de autoincremento

  ```
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Modifica um valor armazenado na memória, não o arquivo de dados.

Em um sistema distribuído que utiliza replicação ou fragmentação, às vezes você redefre o contador de autoincremento de uma tabela para um valor específico. A próxima linha inserida na tabela usa o valor especificado para sua coluna de autoincremento. Você também pode usar essa técnica em um ambiente de data warehousing, onde você periodicamente esvazia todas as tabelas e as carrega novamente, e reinicia a sequência de autoincremento a partir do número 1.

* Fazendo uma coluna `NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

* Fazendo uma coluna `NOT NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Reconstrói a tabela no local. `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` `SQL_MODE` é necessário para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores NULL. O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Veja a Seção 15.1.9, “Declaração ALTER TABLE”. Os dados são reorganizados substancialmente, tornando-os uma operação cara.

* Modificando a definição de uma coluna `ENUM` ou `SET`

  ```
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INSTANT;
  ```

A modificação da definição de uma coluna `ENUM` ou `SET` adicionando novos membros de enumeração ou conjunto ao *final* da lista de valores de membro válidos pode ser realizada instantaneamente ou in loco, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

#### Operações de Coluna Gerada

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna geradas. Para detalhes, consulte a Sintaxe e Notas de Uso.

**Tabela 17.19 Suporte de DDL online para operações de coluna gerada**

<table summary="Online DDL support for generated column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Adding a <code>STORED</code> column</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Modifying <code>STORED</code> column order</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Dropping a <code>STORED</code> column</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Adding a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Modifying <code>VIRTUAL</code> column order</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Dropping a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma coluna `STORED`

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

`ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária) porque a expressão deve ser avaliada pelo servidor.

* Modificando a ordem da coluna `STORED`

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

Refaz a tabela no local.

* Deixar uma coluna `STORED`

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local.

* Adicionando uma coluna `VIRTUAL`

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INSTANT;
  ```

Adicionar uma coluna virtual pode ser feito instantaneamente ou no local para tabelas que não estão particionadas.

Adicionar um `VIRTUAL` não é uma operação de substituição para tabelas particionadas.

* Modificando a ordem da coluna `VIRTUAL`

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

* Deixar uma coluna `VIRTUAL`

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INSTANT;
  ```

A eliminação de uma coluna `VIRTUAL` pode ser realizada instantaneamente ou no local para tabelas não particionadas.

#### Operações de Chave Estrangeira

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave estrangeira. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.20 Suporte de DDL online para operações de chave estrangeira**

<table summary="Online DDL support for foreign key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Adding a foreign key constraint</th> <td>No</td> <td>Yes*</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Dropping a foreign key constraint</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma restrição de chave estrangeira

O algoritmo `INPLACE` é suportado quando o `foreign_key_checks` é desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

* Remover uma restrição de chave estrangeira

  ```
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

A eliminação de uma chave estrangeira pode ser realizada online com a opção `foreign_key_checks` habilitada ou desabilitada.

Se você não conhece os nomes dos constrangimentos de chave estrangeira em uma tabela específica, emita a seguinte declaração e encontre o nome do constrangimento na cláusula `CONSTRAINT` para cada chave estrangeira:

  ```
  SHOW CREATE TABLE table\G
  ```

Ou, consulte a tabela do esquema de informações `TABLE_CONSTRAINTS` e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das chaves estrangeiras.

Você também pode excluir uma chave estrangeira e seu índice associado em uma única declaração:

  ```
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Nota

Se as chaves estrangeiras já estiverem presentes na tabela que está sendo alterada (ou seja, se for uma tabela secundária que contém uma cláusula `FOREIGN KEY ... REFERENCE`, aplicam-se restrições adicionais às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da chave estrangeira:

* Uma `ALTER TABLE` na tabela de crianças pode esperar que outra transação seja confirmada, se uma alteração na tabela de pais causar alterações associadas na tabela de crianças através de uma cláusula `ON UPDATE` ou `ON DELETE` usando os parâmetros `CASCADE` ou `SET NULL`.

* Da mesma forma, se uma tabela é a tabela principal em uma relação de chave estrangeira, mesmo que ela não contenha quaisquer cláusulas `FOREIGN KEY`, ela pode esperar que o `ALTER TABLE` seja concluído se uma declaração `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela secundária.

#### Operações de tabela

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tabela. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.21 Suporte de DDL online para operações de tabela**

<table summary="Online DDL support for table operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Changing the <code>ROW_FORMAT</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Changing the <code>KEY_BLOCK_SIZE</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Setting persistent table statistics</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Specifying a character set</th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Converting a character set</th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>No</td> <td>No</td> </tr><tr> <th scope="row">Optimizing a table</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Rebuilding with the <code>FORCE</code> option</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Performing a null rebuild</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Renaming a table</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Alterar o `ROW_FORMAT`

  ```
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

Para informações adicionais sobre a opção `ROW_FORMAT`, consulte Opções de tabela.

* Alterar o `KEY_BLOCK_SIZE`

  ```
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

Para informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte Opções de tabela.

* Definindo opções de estatísticas persistentes de tabela

  ```
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Apenas modifica o metadados da tabela.

As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando parâmetros de estatísticas persistentes do otimizador”.

* Especificar um conjunto de caracteres

  ```
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Reconstrói a tabela se o novo código de caracteres for diferente.

* Converter um conjunto de caracteres

  ```
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Reconstrói a tabela se o novo código de caracteres for diferente.

* Otimizar uma tabela

  ```
  OPTIMIZE TABLE tbl_name;
  ```

A operação in-place não é suportada para tabelas com índices `FULLTEXT`. A operação utiliza o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

* Refazendo uma tabela com a opção `FORCE`

  ```
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Realizar uma reconstrução "nulo"

  ```
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Renomear uma tabela

  ```
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INSTANT;
  ```

O renomeamento de uma tabela pode ser realizado instantaneamente ou no local. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a declaração `RENAME TABLE`(rename-table.html "15.1.36 RENAME TABLE Statement") para renomear tabelas. Veja a Seção 15.1.36, “Declaração RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tablespace. Para detalhes, consulte a Sintaxe e Notas de Uso.

**Tabela 17.22 Suporte de DDL online para operações de Tablespace**

<table summary="Online DDL support for tablespace operations indicating whether the operation is performed in place, rebuilds tables within the tablespace, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Operation</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Rebuilds Table</th> <th scope="col">Permits Concurrent DML</th> <th scope="col">Only Modifies Metadata</th> </tr></thead><tbody><tr> <th scope="row">Renaming a general tablespace</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Enabling or disabling general tablespace encryption</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Enabling or disabling file-per-table tablespace encryption</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Renomear um espaço de tabela geral

  ```
  ALTER TABLESPACE tablespace_name RENAME TO new_tablespace_name;
  ```

`ALTER TABLESPACE ... RENAME TO` (alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement") utiliza o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

* Habilitar ou desabilitar a criptografia do espaço de tabela geral

  ```
  ALTER TABLESPACE tablespace_name ENCRYPTION='Y';
  ```

`ALTER TABLESPACE ... ENCRYPTION` (alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement") utiliza o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

Para informações relacionadas, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

* Habilitar ou desabilitar a criptografia do espaço de tabela por tabela

  ```
  ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
  ```

Para informações relacionadas, consulte a Seção 17.13, “Encriptação de dados em repouso do InnoDB”.

#### Operações de Partição

Com exceção de algumas cláusulas de particionamento `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), as operações DDL online para tabelas particionadas `InnoDB` seguem as mesmas regras que se aplicam às tabelas regulares `InnoDB`.

Algumas cláusulas de partição `ALTER TABLE` não passam pela mesma API interna de DDL online como as tabelas regulares não particionadas `InnoDB`. Como resultado, o suporte online para cláusulas de partição (alter-table.html "15.1.9 ALTER TABLE Statement")`ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada declaração de particionamento `ALTER TABLE`. Independentemente da API de DDL online que é usada, o MySQL tenta minimizar a cópia e o bloqueio de dados quando possível.

`ALTER TABLE` Opções de particionamento que utilizam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, repare a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela declaração `ALTER TABLE`, e os dados da tabela são copiados na nova estrutura de tabela.

**Tabela 17.23 Suporte de DDL online para operações de particionamento**

<table summary="Online DDL support for partitioning operations indicating whether the operation is performed in place and permits concurrent DML."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th scope="col">Partitioning Clause</th> <th scope="col">Instant</th> <th scope="col">In Place</th> <th scope="col">Permits DML</th> <th scope="col">Notes</th> </tr></thead><tbody><tr> <th scope="row"><code>PARTITION BY</code></th> <td>No</td> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr><tr> <th scope="row"><code>ADD PARTITION</code></th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td><code class="literal">ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code>é suportada para<code>RANGE</code>e<code>LIST</code>partições,<code class="literal">ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSISVE}</code>para<code>HASH</code>e<code>KEY</code>partições, e<code class="literal">ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>para todos os tipos de partição. Não copia dados existentes para tabelas particionadas por<code>RANGE</code>ou<code>LIST</code>. Consultas concorrentes são permitidas com<code>ALGORITHM=COPY</code>para tabelas divididas por<code>HASH</code>ou<code>LIST</code>, pois o MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th scope="row"><code>DROP PARTITION</code></th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td><p> <code class="literal">ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code> is supported. Does not copy data for tables partitioned by <code>RANGE</code> or <code>LIST</code>. </p><p> <code>DROP PARTITION</code> with <code>ALGORITHM=INPLACE</code> deletes data stored in the partition and drops the partition. However, <code>DROP PARTITION</code> with <code>ALGORITHM=COPY</code> or <code>old_alter_table=ON</code> rebuilds the partitioned table and attempts to move data from the dropped partition to another partition with a compatible <code>PARTITION ... VALUES</code> definition. Data that cannot be moved to another partition is deleted. </p></td> </tr><tr> <th scope="row"><code>DISCARD PARTITION</code></th> <td>No</td> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th scope="row"><code>IMPORT PARTITION</code></th> <td>No</td> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">TRUNCATE PARTITION</code></a></th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não copia dados existentes. Ele apenas exclui as linhas; não altera a definição da própria tabela ou de qualquer uma de suas partições.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">COALESCE PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">REORGANIZE PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">EXCHANGE PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th scope="row"><code>ANALYZE PARTITION</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th scope="row"><code>CHECK PARTITION</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">OPTIMIZE PARTITION</code></a></th> <td>Não</td> <td>Não</td> <td>Não</td> <td><code>ALGORITHM</code>e<code>LOCK</code>As cláusulas são ignoradas. Reconstrói toda a tabela. Veja a Seção 26.3.4, “Manutenção de Partições”.</td> </tr><tr> <th scope="row"><code>REBUILD PARTITION</code></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th scope="row"><code>REPAIR PARTITION</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="15.1.9 ALTER TABLE Statement"><code class="literal">REMOVE PARTITIONING</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr></tbody></table>

As operações online sem particionamento em tabelas particionadas seguem as mesmas regras que se aplicam às tabelas regulares. No entanto, `ALTER TABLE` realiza operações online em cada particionamento da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplos particionamentos.

Para informações adicionais sobre as cláusulas de particionamento `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), consulte Opções de particionamento e Seção 15.1.9.1, “Operações de Partição de Tabela”. Para informações sobre particionamento em geral, consulte o Capítulo 26, *Partição*.

### 17.12.1 Desempenho e Concorrência de DDL Online

O DDL online melhora vários aspectos do funcionamento do MySQL:

* As aplicações que acessam a tabela são mais responsivas, pois as consultas e operações de manipulação de dados (DML) na tabela podem prosseguir enquanto a operação de definição de dados (DDL) está em andamento. A redução do bloqueio e a espera por recursos do servidor MySQL levam a uma maior escalabilidade, mesmo para operações que não estão envolvidas na operação de DDL.

* As operações instantâneas apenas modificam os metadados no dicionário de dados. Uma bloqueio exclusivo de metadados na tabela pode ser tomado brevemente durante a fase de execução da operação. Os dados da tabela não são afetados, tornando as operações instantâneas. O DML concorrente é permitido.

* As operações online evitam os ciclos de E/S de disco e de CPU associados ao método de cópia de tabela, o que minimiza a carga geral no banco de dados. Minimizar a carga ajuda a manter um bom desempenho e alto desempenho durante a operação de DDL.

As operações online leem menos dados no buffer do que as operações de cópia de tabela, o que reduz a purga de dados frequentemente acessados da memória. A purga de dados frequentemente acessados pode causar uma queda temporária no desempenho após uma operação de DDL.

#### A cláusula LOCK

Por padrão, o MySQL usa o mínimo de bloqueio possível durante uma operação de DDL. A cláusula `LOCK` pode ser especificada para operações in-place e algumas operações de cópia para impor um bloqueio mais restritivo, se necessário. Se a cláusula `LOCK` especificar um nível de bloqueio menos restritivo do que o permitido para uma operação específica de DDL, a declaração falha com um erro. As cláusulas `LOCK` são descritas abaixo, em ordem de menos restritiva a mais restritiva:

* `LOCK=NONE`:

Permite consultas concorrentes e DML.

Por exemplo, use esta cláusula para tabelas que envolvem inscrições ou compras de clientes, para evitar que as tabelas fiquem indisponíveis durante operações prolongadas de DDL.

* `LOCK=SHARED`:

Permite consultas concorrentes, mas bloqueia DML.

Por exemplo, use esta cláusula em tabelas de data warehouse, onde você pode adiar operações de carregamento de dados até que a operação de DDL esteja concluída, mas as consultas não podem ser adiadas por longos períodos.

* `LOCK=DEFAULT`:

Permite a mesma concorrência possível (consultas concorrentes, DML ou ambas). O omitindo a cláusula `LOCK` é o mesmo que especificar `LOCK=DEFAULT`.

Use esta cláusula quando não espera que o nível de bloqueio padrão da declaração DDL cause quaisquer problemas de disponibilidade para a tabela.

* `LOCK=EXCLUSIVE`:

Bloqueia consultas concorrentes e DML.

Use esta cláusula se a principal preocupação for terminar a operação DDL no menor tempo possível, e o acesso a consultas e DML concorrentes não for necessário. Você também pode usar esta cláusula se o servidor estiver supostamente parado, para evitar acessos inesperados à tabela.

#### Fechamentos de DDL e Metadados Online

As operações de DDL online podem ser vistas como tendo três fases:

* *Fase 1: Inicialização*

Na fase de inicialização, o servidor determina o nível de concorrência permitido durante a operação, levando em conta as capacidades do mecanismo de armazenamento, as operações especificadas na declaração e as opções especificadas pelo usuário `ALGORITHM` e `LOCK`. Durante esta fase, uma chave de metadados compartilhada e atualizável é tomada para proteger a definição atual da tabela.

* *Fase 2: Execução*

Nesta fase, a declaração é preparada e executada. Se a restrição de metadados é atualizada para exclusiva, isso depende dos fatores avaliados na fase de inicialização. Se uma restrição de metadados exclusiva for necessária, ela é apenas tomada brevemente durante a preparação da declaração.

* *Fase 3: Definição da Tabela de Compromissos*

Na fase de definição da tabela de compromisso, o bloqueio de metadados é atualizado para exclusivo para expulsar a definição antiga da tabela e comprometê-la com a nova. Uma vez concedido, a duração do bloqueio exclusivo de metadados é breve.

Devido aos requisitos exclusivos de bloqueio de metadados descritos acima, uma operação online de DDL pode ter que esperar por transações concorrentes que mantêm blocos de metadados na tabela para ser concluída ou revogada. As transações iniciadas antes ou durante a operação de DDL podem manter blocos de metadados na tabela que está sendo alterada. No caso de uma transação em andamento ou inativa, uma operação online de DDL pode expirar enquanto espera por um bloqueio de metadados exclusivo. Além disso, um bloqueio de metadados exclusivo pendente solicitado por uma operação online de DDL bloqueia transações subsequentes na tabela.

O exemplo a seguir demonstra uma operação DDL online aguardando uma bloqueio exclusivo de metadados e como um bloqueio de metadados pendente bloqueia transações subsequentes na tabela.

Sessão 1:

```
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

A declaração `SELECT` da sessão 1 obtém uma garantia de metadados compartilhada na tabela t1.

Sessão 2:

```
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

A operação DDL online na sessão 2, que requer um bloqueio exclusivo de metadados na tabela t1 para confirmar as alterações na definição da tabela, deve esperar que a transação da sessão 1 seja confirmada ou revertida.

Sessão 3:

```
mysql> SELECT * FROM t1;
```

A declaração `SELECT` emitida na sessão 3 está bloqueada, aguardando que o bloqueio exclusivo de metadados solicitado pela operação `ALTER TABLE` na sessão 2 seja concedido.

Você pode usar `SHOW FULL PROCESSLIST` (show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") para determinar se as transações estão aguardando uma trava de metadados.

```
mysql> SHOW FULL PROCESSLIST\G
...
*************************** 2. row ***************************
     Id: 5
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 44
  State: Waiting for table metadata lock
   Info: ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE
...
*************************** 4. row ***************************
     Id: 7
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 5
  State: Waiting for table metadata lock
   Info: SELECT * FROM t1
4 rows in set (0.00 sec)
```

As informações de bloqueio de metadados também são exibidas na tabela do Schema de desempenho `metadata_locks`, que fornece informações sobre as dependências de bloqueio de metadados entre as sessões, o bloqueio de metadados que uma sessão está esperando e a sessão que atualmente detém o bloqueio de metadados. Para mais informações, consulte a Seção 29.12.13.3, “A tabela metadados_locks”.

#### Desempenho do DDL online

O desempenho de uma operação DDL é em grande parte determinado pelo fato de a operação ser realizada instantaneamente, no local e se ela reconstrui a tabela.

Para avaliar o desempenho relativo de uma operação de DDL, você pode comparar os resultados usando `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Uma declaração também pode ser executada com `old_alter_table` habilitada para forçar o uso de `ALGORITHM=COPY`.

Para operações de DDL que modificam dados de tabela, você pode determinar se uma operação de DDL realiza alterações no local ou realiza uma cópia da tabela, observando o valor "linhas afetadas" exibido após o término do comando. Por exemplo:

* Alterar o valor padrão de uma coluna (rápido, não afeta os dados da tabela):

  ```
  Query OK, 0 rows affected (0.07 sec)
  ```

* Adicionar um índice (leva tempo, mas `0 rows affected` mostra que a tabela não é copiada):

  ```
  Query OK, 0 rows affected (21.42 sec)
  ```

* Alterar o tipo de dados de uma coluna (leva tempo substancial e exige a reconstrução de todas as linhas da tabela):

  ```
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Antes de executar uma operação DDL em uma tabela grande, verifique se a operação é rápida ou lenta da seguinte forma:

1. Faça uma cópia da estrutura da tabela.
2. Encha a tabela copiada com uma pequena quantidade de dados.
3. Execute a operação DDL na tabela copiada.
4. Verifique se o valor "rows affected" é zero ou não. Um valor diferente de zero significa que a operação copia os dados da tabela, o que pode exigir um planejamento especial. Por exemplo, você pode realizar a operação DDL durante um período de indisponibilidade programada ou em cada servidor replicado, um de cada vez.

Nota

Para uma compreensão mais aprofundada do processamento do MySQL associado a uma operação de DDL, examine o Gerador de desempenho e as tabelas `INFORMATION_SCHEMA` relacionadas a `InnoDB` antes e depois das operações de DDL para ver o número de leituras físicas, escritas, alocações de memória, etc.

Os eventos de estágio do esquema de desempenho podem ser usados para monitorar o progresso do `ALTER TABLE`. Veja [Seção 17.16.1, “Monitoramento do progresso da ALTER TABLE para tabelas InnoDB usando o esquema de desempenho”][(monitor-alter-table-performance-schema.html "17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema")].

Como há algum trabalho de processamento envolvido na gravação das alterações feitas por operações DML concorrentes, e depois na aplicação dessas alterações no final, uma operação online de DDL pode levar mais tempo no geral do que o mecanismo de cópia de tabela que bloqueia o acesso à tabela de outras sessões. A redução no desempenho bruto é compensada pela melhor capacidade de resposta para aplicativos que usam a tabela. Ao avaliar as técnicas para alterar a estrutura da tabela, considere a percepção do usuário final do desempenho, com base em fatores como os tempos de carregamento das páginas da web.

### 17.12.3 Requisitos de Espaço para DDL Online

Os requisitos de espaço em disco para operações DDL online são descritos abaixo. Os requisitos não se aplicam a operações que são realizadas instantaneamente.

* Arquivos de registro temporários:

Um arquivo de registro temporário registra DML concorrente quando uma operação online de DDL cria um índice ou altera uma tabela. O arquivo de registro temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size` até um máximo especificado por `innodb_online_alter_log_max_size`. Se a operação levar um longo tempo e a DML concorrente modificar a tabela tanto que o tamanho do arquivo de registro temporário exceda o valor de `innodb_online_alter_log_max_size`, a operação online de DDL falha com um erro `DB_ONLINE_LOG_TOO_BIG`, e as operações DML concorrentes não comprometidas são revertidas. Um grande ajuste de `innodb_online_alter_log_max_size` permite mais DML durante uma operação online de DDL, mas também estende o período de tempo no final da operação de DDL quando a tabela é bloqueada para aplicar DML registrada.

A variável `innodb_sort_buffer_size` também define o tamanho do buffer de leitura e do buffer de escrita do arquivo de registro temporário.

* Arquivos temporários:

As operações DDL online que reconstroem a tabela escrevem arquivos temporários de ordenação no diretório temporário do MySQL (`$TMPDIR` em Unix, `%TEMP%` em Windows ou o diretório especificado por `--tmpdir`) durante a criação do índice. Arquivos temporários de ordenação não são criados no diretório que contém a tabela original. Cada arquivo temporário de ordenação é grande o suficiente para conter uma coluna de dados, e cada arquivo de ordenação é removido quando seus dados são agregados à tabela ou índice final. As operações que envolvem arquivos temporários de ordenação podem exigir espaço temporário igual à quantidade de dados na tabela mais os índices. Um erro é relatado se a operação DDL online usa todo o espaço disponível no sistema de arquivos onde o diretório de dados reside.

Se o diretório temporário do MySQL não for grande o suficiente para conter os arquivos de classificação, defina `tmpdir` para um diretório diferente. Alternativamente, defina um diretório temporário separado para operações DDL online usando `innodb_tmpdir`. Esta opção foi introduzida para ajudar a evitar a sobrecarga do diretório temporário que poderia ocorrer como resultado de grandes arquivos de classificação temporários.

* Arquivos de tabela intermediários:

Algumas operações de DDL online que reconstroem a tabela criam um arquivo de tabela intermediária temporária no mesmo diretório da tabela original. Um arquivo de tabela intermediária pode exigir espaço igual ao tamanho da tabela original. Os nomes dos arquivos de tabela intermediária começam com o prefixo `#sql-ib` e aparecem apenas brevemente durante a operação de DDL online.

A opção `innodb_tmpdir` não é aplicável a arquivos de tabela intermediários.

### 17.12.4 Gerenciamento de memória DDL online

As operações DDL online que criam ou reconstroem índices secundários alocam tampões temporários durante diferentes fases da criação do índice. A variável `innodb_ddl_buffer_size`, introduzida no MySQL 8.0.27, define o tamanho máximo do buffer para operações DDL online. O ajuste padrão é de 1048576 bytes (1 MB). O ajuste se aplica a tampões criados por threads que executam operações DDL online. Definir um limite de tamanho de buffer apropriado evita potenciais erros de memória para operações DDL online que criam ou reconstroem índices secundários. O tamanho máximo do buffer por thread DDL é o tamanho máximo do buffer dividido pelo número de threads DDL (`innodb_ddl_buffer_size`/`innodb_ddl_threads`).

Antes do MySQL 8.0.27, a variável `innodb_sort_buffer_size` define o tamanho do buffer para operações DDL online que criam ou reconstruem índices secundários.

### 17.12.5 Configurando Threads Paralelas para Operações de DDL Online

O fluxo de trabalho de uma operação de DDL online que cria ou reconstrui um índice secundário envolve:

* Digitalização do índice agrupado e escrita de dados em arquivos temporários de classificação

* Ordenar os dados * Carregar os dados ordenados dos arquivos temporários de classificação no índice secundário

O número de fios paralelos que podem ser usados para escanear um índice agrupado é definido pela variável `innodb_parallel_read_threads`. O ajuste padrão é 4. O ajuste máximo é 256, que é o número máximo para todas as sessões. O número real de fios que escanea o índice agrupado é o número definido pelo ajuste `innodb_parallel_read_threads` ou o número de subárvores do índice a serem escaneadas, o que for menor. Se o limite de fios for atingido, as sessões retornam a usar um único fio.

O número de threads paralelas que fazem a classificação e carregam dados é controlado pela variável `innodb_ddl_threads`, introduzida no MySQL 8.0.27. O ajuste padrão é 4. Antes do MySQL 8.0.27, as operações de classificação e carregamento são realizadas por uma única thread.

As seguintes limitações se aplicam:

* Os fios paralelos não são suportados para a construção de índices que incluem colunas virtuais.

* Os fios paralelos não são suportados para a criação de índices de texto completo.

* Não são suportados fios paralelos para a criação de índices espaciais. * O varredura paralela não é suportada em tabelas definidas com colunas virtuais.

* O varredura paralela não é suportada em tabelas definidas com um índice de texto completo.

* O varredura paralela não é suportada em tabelas definidas com um índice espacial.

### 17.12.6 Simplificando declarações DDL com DDL online

Antes da introdução do [online DDL][(glossary.html#glos_online_ddl "online DDL")], era prática comum combinar muitas operações de DDL em uma única declaração `ALTER TABLE`. Como cada declaração `ALTER TABLE` envolvia a cópia e reconstrução da tabela, era mais eficiente fazer várias alterações na mesma tabela de uma vez, uma vez que essas alterações poderiam ser feitas todas com uma única operação de reconstrução para a tabela. O inconveniente era que o código SQL envolvendo operações de DDL era mais difícil de manter e reutilizar em diferentes scripts. Se as alterações específicas fossem diferentes a cada vez, você poderia ter que construir um novo [`ALTER TABLE`][(alter-table.html "15.1.9 ALTER TABLE Statement")] complexo para cada cenário ligeiramente diferente.

Para operações de DDL que podem ser feitas online, você pode separá-las em declarações individuais `ALTER TABLE` para facilitar a criação de scripts e a manutenção, sem sacrificar a eficiência. Por exemplo, você pode tomar uma declaração complicada, como:

```
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

e que o decomponha em partes mais simples que possam ser testadas e realizadas de forma independente, como:

```
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

Você ainda pode usar declarações de vários trechos `ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") para:

* Operações que devem ser realizadas em uma sequência específica, como criar um índice seguido de uma restrição de chave estrangeira que utilize esse índice.

* As operações utilizam todas a mesma cláusula específica `LOCK`, que você quer que seja bem-sucedida ou falha como um grupo.

* Operações que não podem ser realizadas online, ou seja, que ainda utilizam o método de cópia de tabela.

* Operações para as quais você especificar `ALGORITHM=COPY` ou `old_alter_table=1`, para forçar o comportamento de cópia de tabela, se necessário, para compatibilidade precisa em cenários especializados.

### 17.12.7 Condições de falha no DDL online

O fracasso de uma operação de DDL online geralmente ocorre devido a uma das seguintes condições:

* Uma cláusula `ALGORITHM` especifica um algoritmo que não é compatível com o tipo específico de operação de DDL ou motor de armazenamento.

* Uma cláusula `LOCK` especifica um baixo grau de bloqueio (`SHARED` ou `NONE`) que não é compatível com o tipo específico de operação DDL.

* Um tempo de espera ocorre enquanto espera por um bloqueio exclusivo na tabela, que pode ser necessário brevemente durante as fases inicial e final da operação de DDL.

* O sistema de arquivos `tmpdir` ou `innodb_tmpdir` fica sem espaço em disco, enquanto o MySQL escreve arquivos temporários de classificação no disco durante a criação de índices. Para mais informações, consulte a Seção 17.12.3, “Requisitos de espaço DDL online”.

* A operação leva muito tempo e a DML concorrente modifica a tabela tanto que o tamanho do log online temporário excede o valor da opção de configuração `innodb_online_alter_log_max_size`. Esta condição causa um erro `DB_ONLINE_LOG_TOO_BIG`.

* O DML concorrente faz alterações na tabela que são permitidas com a definição original da tabela, mas não com a nova. A operação só falha no final, quando o MySQL tenta aplicar todas as alterações das declarações de DML concorrente. Por exemplo, você pode inserir valores duplicados em uma coluna enquanto um índice único está sendo criado, ou pode inserir valores `NULL` em uma coluna enquanto está sendo criado um índice de chave primária nessa coluna. As alterações feitas pelo DML concorrente têm precedência, e a operação `ALTER TABLE` é efetivamente [revertida][(glossary.html#glos_rollback "rollback")].

### 17.12.8 Limitações de DDL online

As seguintes limitações se aplicam às operações DDL online:

* A tabela é copiada ao criar um índice em um `TEMPORARY TABLE`.

* A cláusula `ALTER TABLE` `LOCK=NONE` não é permitida se houver restrições `ON...CASCADE` ou `ON...SET NULL` na tabela.

* Antes que uma operação de DDL online em local possa ser concluída, ela deve esperar por transações que possuam bloqueios de metadados na tabela para serem confirmadas ou revertidas. Uma operação de DDL online pode exigir brevemente um bloqueio exclusivo de metadados na tabela durante sua fase de execução, e sempre requer um na fase final da operação ao atualizar a definição da tabela. Consequentemente, transações que possuam bloqueios de metadados na tabela podem fazer com que uma operação de DDL online seja bloqueada. As transações que possuam bloqueios de metadados na tabela podem ter sido iniciadas antes ou durante a operação de DDL online. Uma transação longa ou inativa que possua um bloqueio de metadados na tabela pode fazer com que uma operação de DDL online seja temporariamente suspensa.

* Ao executar uma operação de DDL online in-place, o fio que executa a declaração `ALTER TABLE` aplica um registro online de operações de DML que foram executadas simultaneamente na mesma tabela de outros fios de conexão. Quando as operações de DML são aplicadas, é possível encontrar um erro de entrada de chave duplicada (ERROR 1062 (23000): Entrada duplicada), mesmo que a entrada duplicada seja apenas temporária e seja revertida por uma entrada posterior no registro online. Isso é semelhante à ideia de uma verificação de restrição de chave estrangeira em `InnoDB`, na qual as restrições devem ser mantidas durante uma transação.

* `OPTIMIZE TABLE` para uma tabela `InnoDB` é mapeado para uma operação `ALTER TABLE` para reconstruir a tabela e atualizar estatísticas de índice e liberar espaço não utilizado no índice agrupado. Índices secundários não são criados de forma eficiente, pois as chaves são inseridas na ordem em que apareceram na chave primária. `OPTIMIZE TABLE` é suportado com a adição de suporte DDL online para reconstruir tabelas regulares e particionadas `InnoDB`.

* As tabelas criadas antes do MySQL 5.6 que incluem colunas temporais (`DATE`, `DATETIME` ou `TIMESTAMP`) e não foram reconstruídas usando  `ALGORITHM=COPY` não suportam `ALGORITHM=INPLACE`. Neste caso, uma operação [`ALTER TABLE ... ALGORITHM=INPLACE`(alter-table.html "15.1.9 ALTER TABLE Statement") retorna o seguinte erro:

  ```
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

* As seguintes limitações geralmente se aplicam a operações de DDL online em tabelas grandes que envolvem a reconstrução da tabela:

+ Não há mecanismo para pausar uma operação de DDL online ou para limitar o uso de I/O ou CPU para uma operação de DDL online.

O recuo de uma operação de DDL online pode ser caro caso a operação falhe.

+ Operações de DDL online de longa duração podem causar atraso na replicação. Uma operação de DDL online deve terminar de ser executada na fonte antes de ser executada na replica. Além disso, as DML que foram processadas simultaneamente na fonte são processadas apenas na replica após a operação de DDL na replica ser concluída.

Para informações adicionais relacionadas à execução de operações DDL online em tabelas grandes, consulte a Seção 17.12.2, “Desempenho e Concorrência DDL Online”.