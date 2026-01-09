### 17.12.1 Operações DDL Online

Detalhes de suporte online, exemplos de sintaxe e notas de uso para operações DDL são fornecidos sob os seguintes tópicos nesta seção.

* Operações de Índice
* Operações de Chave Primária
* Operações de Coluna
* Operações de Coluna Gerada
* Operações de Chave Estrangeira
* Operações de Tabela
* Operações de Tablespace
* Operações de Partição

#### Operações de Índice

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de índice. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 17.13 Suporte DDL Online para Operações de Índice**

<table summary="Suporte DDL online para operações de índice, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstitui a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Criando ou adicionando um índice secundário</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Excluindo um índice</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Renomeando um índice</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Adicionando um índice <code>FULLTEXT</code></th> <td>Não</td> <td>Sim*</td> <td>Não*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Adicionando um índice <code>SPATIAL</code></th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Mudando o tipo de índice</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Notas de Sintaxe e Uso

* Criando ou adicionando um índice secundário

  ```
  CREATE INDEX name ON table (col_list);
  ```

  ```
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo criado. A instrução `CREATE INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

O suporte DDL online para adicionar índices secundários permite que você geralmente acelere o processo geral de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando índices secundários após o carregamento dos dados.

Um índice secundário recém-criado contém apenas os dados comprometidos na tabela no momento em que a instrução `CREATE INDEX` ou `ALTER TABLE` termina de ser executada. Ele não contém quaisquer valores não comprometidos, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do índice antigo.

Alguns fatores afetam o desempenho, o uso de espaço e a semântica dessa operação. Para detalhes, consulte a Seção 17.12.8, “Limitações DDL online”.

* Remover um índice

```
  DROP INDEX name ON table;
  ```

```
  ALTER TABLE tbl_name DROP INDEX name;
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo removido. A instrução `DROP INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

* Renomear um índice

```
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adicionar um índice `FULLTEXT`

```
  CREATE FULLTEXT INDEX name ON table(column);
  ```

A adição do primeiro índice `FULLTEXT` reconstrui a tabela se não houver uma coluna `FTS_DOC_ID` definida pelo usuário. Índices `FULLTEXT` adicionais podem ser adicionados sem a necessidade de reconstruir a tabela.

* Adicionar um índice `SPATIAL`

```
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Alterar o tipo de índice (`USING {BTREE | HASH}`)

```
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INSTANT;
  ```

#### Operações de Chave Primária
```
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

```
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INSTANT;
  ```

```
  ALTER TABLE t1 ADD COLUMN c2 INT, ADD COLUMN c3 INT, ALGORITHM=INSTANT;
  ```

```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

```
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INSTANT;
  ```

```
  ALTER TABLE t1 DROP COLUMN c4, DROP COLUMN c5, ALGORITHM=INSTANT;
  ```

```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

```
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INSTANT;
  ```

```
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

```
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de chave primária. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Consulte as Notas de Sintaxe e Uso.

**Tabela 17.14 Suporte DDL Online para Operações de Chave Primária**

<table summary="Suporte DDL online para operações de chave primária indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstrói a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma chave primária</th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Remover uma chave primária</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma chave primária e adicionar outra</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr></tbody></table>

##### Notas de Sintaxe e Uso

* Adicionar uma chave primária

  ```
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara. `ALGORITHM=INPLACE` não é permitido sob certas condições se as colunas tiverem que ser convertidas para `NOT NULL`.

A reestruturação do índice agrupado sempre requer a cópia dos dados da tabela. Portanto, é melhor definir a chave primária ao criar uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` mais tarde.

Quando você cria um índice `UNIQUE` ou `PRIMARY KEY`, o MySQL deve realizar algum trabalho extra. Para índices `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a chave. Para um índice `PRIMARY KEY`, o MySQL também verifica se nenhuma das colunas `PRIMARY KEY` contém um `NULL`.

Quando você adiciona uma chave primária usando a cláusula `ALGORITHM=COPY`, o MySQL converte os valores `NULL` nas colunas associadas em valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Esse é um comportamento não padrão que o Oracle não recomenda que você confie. Adicionar uma chave primária usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui as flags `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é rigorosa, `ALGORITHM=INPLACE` é permitido, mas a declaração ainda pode falhar se as colunas da chave primária solicitadas contiverem valores `NULL`. O comportamento `ALGORITHM=INPLACE` é mais compatível com o padrão.

Se você criar uma tabela sem uma chave primária, o `InnoDB` escolhe uma para você, que pode ser a primeira chave `UNIQUE` definida em colunas `NOT NULL`, ou uma chave gerada pelo sistema. Para evitar incerteza e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da declaração `CREATE TABLE`.

O MySQL cria um novo índice agrupado copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de índice desejada. Uma vez que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome diferente para a tabela temporária. A tabela temporária que compõe o novo índice agrupado é renomeada com o nome da tabela original, e a tabela original é excluída do banco de dados.

Os aprimoramentos de desempenho online que se aplicam às operações em índices secundários não se aplicam ao índice de chave primária. As linhas de uma tabela InnoDB são armazenadas em um índice agrupado organizado com base na chave primária, formando o que alguns sistemas de banco de dados chamam de "tabela organizada por índice". Como a estrutura da tabela está intimamente ligada à chave primária, redefinir a chave primária ainda requer a cópia dos dados.

Quando uma operação na chave primária usa `ALGORITHM=INPLACE`, embora os dados ainda sejam copiados, é mais eficiente do que usar `ALGORITHM=COPY`, porque:

+ Não é necessário registro de log de desfazer ou log de redo associado a `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às declarações DDL que usam `ALGORITHM=COPY`.

+ As entradas do índice secundário são pré-ordenadas e, portanto, podem ser carregadas em ordem.

+ O buffer de mudança não é usado, porque não há inserções de acesso aleatório nos índices secundários.

* Excluindo uma chave primária

  ```
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Apenas `ALGORITHM=COPY` suporta a exclusão de uma chave primária sem adicionar uma nova na mesma declaração `ALTER TABLE`.

* Excluindo uma chave primária e adicionando outra

  ```
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INSTANT;
  ```

  Os dados são reorganizados substancialmente, tornando-a uma operação cara.

#### Operações com Colunas

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de coluna. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.15 Suporte DDL online para operações de coluna**

<table summary="Suporte DDL online para operações de coluna, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstitui a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Não*</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th>Remover uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Renomear uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Não</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th>Rearranjar colunas</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Definir um valor padrão para uma coluna</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o tipo de dados de uma coluna</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Aumentar o tamanho de uma coluna <code>VARCHAR</code></th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Remover o valor padrão da coluna</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o valor de autoincremento</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não*</td> </tr><tr> <th>Tornar uma coluna <code>NULL</code></th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Tornar uma coluna <code>NOT NULL</code></th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Modificar a definição de uma coluna <code>ENUM</code> ou <code>SET</code></th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Notas de sintaxe e uso

* Adicionando uma coluna

  ```
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INSTANT;
  ```

  `INSTANT` é o algoritmo padrão no MySQL 9.5.

  As seguintes limitações se aplicam quando o algoritmo `INSTANT` adiciona uma coluna:

  + Uma declaração não pode combinar a adição de uma coluna com outras ações `ALTER TABLE` que não suportam o algoritmo `INSTANT`.

  + O algoritmo `INSTANT` pode adicionar uma coluna em qualquer posição na tabela.

  + Colunas não podem ser adicionadas a tabelas que usam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. Tabelas temporárias só suportam `ALGORITHM=COPY`.

  + O MySQL verifica o tamanho da linha quando o algoritmo `INSTANT` adiciona uma coluna e lança o seguinte erro se a adição exceder o limite.

    ERROR 4092 (HY000): A coluna não pode ser adicionada com ALGORITHM=INSTANT, pois o tamanho máximo possível da linha excede o tamanho máximo permitido da linha. Tente ALGORITHM=INPLACE/COPY.

  + O número máximo de colunas na representação interna da tabela não pode exceder 1022 após a adição de colunas com o algoritmo `INSTANT`. A mensagem de erro é:

    ERROR 4158 (HY000): A coluna não pode ser adicionada a *`tbl_name`* com ALGORITHM=INSTANT mais. Tente ALGORITHM=INPLACE/COPY

  + O algoritmo `INSTANT` não pode adicionar ou excluir colunas de tabelas do esquema do sistema, como a tabela interna `mysql`.

  + Uma coluna com um índice funcional não pode ser excluída usando o algoritmo `INSTANT`.

  Várias colunas podem ser adicionadas na mesma declaração `ALTER TABLE`. Por exemplo:

  ```
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Uma nova versão da linha é criada após cada operação `ALTER TABLE ... ALGORITHM=INSTANT` que adiciona uma ou mais colunas, exclui uma ou mais colunas ou adiciona e exclui uma ou mais colunas na mesma operação. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` rastreia o número de versões da linha para uma tabela. O valor é incrementado cada vez que uma coluna é adicionada ou excluída instantaneamente. O valor inicial é 0.

```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Quando uma tabela com colunas adicionadas ou excluídas instantaneamente é reconstruída por uma operação `ALTER TABLE` ou `OPTIMIZE TABLE` de reconstrução da tabela, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões da linha permitido é 255, pois cada versão da linha requer espaço adicional para o metadados da tabela. Quando o limite de versões da linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` usando `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

ERRO 4092 (HY000): Máximo de versões da linha alcançado para a tabela test/t1. Não é possível adicionar ou excluir colunas instantaneamente. Use COPY/INPLACE.

As seguintes colunas do `INFORMATION_SCHEMA` fornecem metadados adicionais para colunas adicionadas instantaneamente. Consulte as descrições dessas colunas para obter mais informações. Veja a Seção 28.4.9, “A Tabela INFORMATION_SCHEMA INNODB_COLUMNS”, e a Seção 28.4.23, “A Tabela INFORMATION_SCHEMA INNODB_TABLES”.

+ `INNODB_COLUMNS.DEFAULT_VALUE`
+ `INNODB_COLUMNS.HAS_DEFAULT`
+ `INNODB_TABLES.INSTANT_COLS`

A DML concorrente não é permitida ao adicionar uma coluna de autoincremento. Os dados são reorganizados substancialmente, tornando-a uma operação cara. No mínimo, `ALGORITHM=INPLACE, LOCK=SHARED` é necessário.

A tabela é reconstruída se `ALGORITHM=INPLACE` for usado para adicionar uma coluna.

* Remover uma coluna

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  `INSTANT` é o algoritmo padrão no MySQL 9.5.

  As seguintes limitações se aplicam ao uso do algoritmo `INSTANT` para remover uma coluna:

  + A remoção de uma coluna não pode ser combinada na mesma instrução com outras ações `ALTER TABLE` que não suportam `ALGORITHM=INSTANT`.

  + Colunas não podem ser removidas de tabelas que usam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. As tabelas temporárias só suportam `ALGORITHM=COPY`.

  Pode-se remover várias colunas na mesma instrução `ALTER TABLE`; por exemplo:

  ```
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INSTANT;
  ```

  Cada vez que uma coluna é adicionada ou removida usando `ALGORITHM=INSTANT`, uma nova versão da linha é criada. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` registra o número de versões da linha para uma tabela. O valor é incrementado cada vez que uma coluna é adicionada ou removida instantaneamente. O valor inicial é 0.

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  Quando uma tabela com colunas adicionadas ou removidas instantaneamente é reconstruída por uma operação `ALTER TABLE` de reconstrução de tabela ou `OPTIMIZE TABLE`, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões da linha permitido é 255, pois cada versão da linha requer espaço adicional para o metadados da tabela. Quando o limite de versões da linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` usando `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

  ERRO 4092 (HY000): Máximo de versões da linha alcançado para a tabela test/t1. Não é possível adicionar ou remover mais colunas instantaneamente. Use COPY/INPLACE.

  Se for usado um algoritmo diferente de `ALGORITHM=INSTANT`, os dados são reorganizados substancialmente, tornando-se uma operação cara.

* Renomear uma coluna

```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

Para permitir DML concorrente, mantenha o mesmo tipo de dados e altere apenas o nome da coluna.

Quando você mantém o mesmo tipo de dados e o atributo `[NOT] NULL`, alterando apenas o nome da coluna, a operação sempre pode ser realizada online.

Renomear uma coluna referenciada de outra tabela é permitido apenas com `ALGORITHM=INPLACE`. Se você usar `ALGORITHM=INSTANT`, `ALGORITHM=COPY` ou alguma outra condição que faça com que a operação use esses algoritmos, a instrução `ALTER TABLE` falha.

`ALGORITHM=INSTANT` suporta o renomeamento de uma coluna virtual; `ALGORITHM=INPLACE` não.

`ALGORITHM=INSTANT` e `ALGORITHM=INPLACE` não suportam o renomeamento de uma coluna ao adicionar ou excluir uma coluna virtual na mesma instrução. Nesse caso, apenas `ALGORITHM=COPY` é suportado.

* Rearranjar colunas

  Para rearranjar colunas, use `FIRST` ou `AFTER` nas operações `CHANGE` ou `MODIFY`.

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando-a uma operação cara.

* Alterar o tipo de dado da coluna

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INSTANT;
  ```

  Alterar o tipo de dado da coluna é suportado apenas com `ALGORITHM=COPY`.

* Extender o tamanho da coluna `VARCHAR`

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

O número de bytes de comprimento necessários para uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` de tamanho entre 0 e 255 bytes, um byte de comprimento é necessário para codificar o valor. Para colunas `VARCHAR` de tamanho igual a 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, a `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. A `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de um único byte de VARCHAR(255) para VARCHAR(256) usando `ALTER TABLE` in-place retorna este erro:

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INSTANT;
  ```

  Nota

  O comprimento em bytes de uma coluna `VARCHAR` depende do comprimento em bytes do conjunto de caracteres.

  A redução do tamanho `VARCHAR` usando `ALTER TABLE` in-place não é suportada. A redução do tamanho `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

* Definir um valor padrão para uma coluna

  ```
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

  Apenas modifica os metadados da tabela. Os valores padrão das colunas são armazenados no dicionário de dados.

* Remover o valor padrão de uma coluna

  ```
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

* Alterar o valor de autoincremento

  ```
  SHOW CREATE TABLE table\G
  ```

  Modifica um valor armazenado na memória, não o arquivo de dados.

Em um sistema distribuído que utiliza replicação ou particionamento, às vezes você precisa reinicializar o contador de autoincremento de uma tabela para um valor específico. A próxima linha inserida na tabela usa o valor especificado para sua coluna de autoincremento. Você também pode usar essa técnica em um ambiente de data warehousing, onde você limpa periodicamente todas as tabelas e as carrega novamente, e reinicia a sequência de autoincremento a partir do 1.

* Tornar uma coluna `NULL`

  ```
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

  Reconstrói a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

* Tornar uma coluna `NOT NULL`

  ```
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local. O `SQL_MODE` `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` é necessário para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores `NULL`. O servidor proíbe alterações em colunas de chave estrangeira que tenham o potencial de causar perda de integridade referencial. Veja a Seção 15.1.11, “Instrução ALTER TABLE”. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

* Modificar a definição de uma coluna `ENUM` ou `SET`

  ```
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modificar a definição de uma coluna `ENUM` ou `SET` adicionando novos membros de enumeração ou conjunto ao *final* da lista de valores de membro válidos pode ser feito instantaneamente ou no local, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

#### Operações de Coluna Gerada

O seguinte quadro fornece uma visão geral do suporte DDL online para operações de coluna gerada. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 17.16 Suporte DDL Online para Operações de Coluna Gerada**

<table summary="Suporte DDL online para operações de coluna gerada indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstrói a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna <code>STORED</code></th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Modificar a ordem da coluna <code>STORED</code></th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna <code>STORED</code></th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Adicionar uma coluna <code>VIRTUAL</code></th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Modificar a ordem da coluna <code>VIRTUAL</code></th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna <code>VIRTUAL</code></th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Notas de Sintaxe e Uso

* Adicionar uma coluna `STORED`

  ```
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

`ADICIONAR COLUNA` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor.

* Modificar a ordem da coluna `STORED`

  ```
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela in-place.

* Remover uma coluna `STORED`

  ```
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela in-place.

* Adicionar uma coluna `VIRTUAL`

  ```
  OPTIMIZE TABLE tbl_name;
  ```

  A adição de uma coluna virtual pode ser realizada instantaneamente ou in-place para tabelas não particionadas.

* Adicionar uma coluna `VIRTUAL` não é uma operação in-place para tabelas particionadas.

* Modificar a ordem da coluna `VIRTUAL`

  ```
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Remover uma coluna `VIRTUAL`

  ```
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Remover uma coluna `VIRTUAL` pode ser realizada instantaneamente ou in-place para tabelas não particionadas.

#### Operações de Chave Estrangeira

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de chave estrangeira. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 17.17 Suporte DDL Online para Operações de Chave Estrangeira**

<table summary="Suporte DDL online para operações de chave estrangeira, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstrói a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma restrição de chave estrangeira</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Remover uma restrição de chave estrangeira</th> <td>Não</td> <td>Sim</th> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Notas de Sintaxe e Uso

* Adicionar uma restrição de chave estrangeira

  O algoritmo `INPLACE` é suportado quando `foreign_key_checks` está desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INSTANT;
  ```

* Remover uma restrição de chave estrangeira

  ```
  ALTER TABLESPACE tablespace_name RENAME TO new_tablespace_name;
  ```

  A remoção de uma chave estrangeira pode ser realizada online com a opção `foreign_key_checks` habilitada ou desabilitada.

  Se você não conhece os nomes das restrições de chave estrangeira de uma tabela específica, execute a seguinte declaração e encontre o nome da restrição na cláusula `CONSTRAINT` para cada chave estrangeira:

  ```
  ALTER TABLESPACE tablespace_name ENCRYPTION='Y';
  ```

  Ou, consulte a tabela do Schema de Informações `TABLE_CONSTRAINTS` e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das chaves estrangeiras.

  Você também pode remover uma chave estrangeira e seu índice associado em uma única declaração:

  ```
  ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
  ```

Observação

Se as chaves estrangeiras já estiverem presentes na tabela que está sendo alterada (ou seja, se for uma tabela filha que contém uma cláusula `FOREIGN KEY ... REFERENCE`), restrições adicionais se aplicam às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da chave estrangeira:

* Uma `ALTER TABLE` na tabela filha pode esperar que outra transação seja confirmada, se uma alteração na tabela pai causar alterações associadas na tabela filha por meio de uma cláusula `ON UPDATE` ou `ON DELETE` usando os parâmetros `CASCADE` ou `SET NULL`.

* Da mesma forma, se uma tabela for a tabela pai em uma relação de chave estrangeira, mesmo que não contenha nenhuma cláusula `FOREIGN KEY`, ela pode esperar que a `ALTER TABLE` seja concluída se uma instrução `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela filha.

#### Operações de Tabela

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de tabela. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de Sintaxe e Uso.

**Tabela 17.18 Suporte DDL Online para Operações de Tabela**

<table summary="Suporte DDL online para operações de tabela, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instante</th> <th>No Local</th> <th>Reconstitui a Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Alterar o <code>ROW_FORMAT</code></th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Alterar o <code>KEY_BLOCK_SIZE</code></th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Definir estatísticas persistentes da tabela</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Especificar um conjunto de caracteres</th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Converter um conjunto de caracteres</th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Otimizar uma tabela</th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Reconstituir com a opção <code>FORCE</code></th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Realizar uma reconstrução nula</th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Renomear uma tabela</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Notas de sintaxe e uso

* Alterar o `ROW_FORMAT`

  

  Os dados são reorganizados substancialmente, tornando-a uma operação cara.

  Para obter informações adicionais sobre a opção `ROW_FORMAT`, consulte Opções de tabela.

* Alterar o `KEY_BLOCK_SIZE`

  

  Os dados são reorganizados substancialmente, tornando-a uma operação cara.

  Para obter informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte Opções de tabela.

* Definir opções de estatísticas de tabela persistentes

  

  Apenas modifica o metadados da tabela.

  As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para obter mais informações, consulte Seção 17.8.10.1, “Configurando parâmetros de estatísticas de otimizador persistentes”.

* Especificar um conjunto de caracteres

  

  Reorganiza a tabela se o novo codificação de caracteres for diferente.

* Converter um conjunto de caracteres

  

  Reorganiza a tabela se o novo codificação de caracteres for diferente.

* Otimizar uma tabela

  

  A operação in-place não é suportada para tabelas com índices `FULLTEXT`. A operação usa o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

* Reorganizar uma tabela com a opção `FORCE`

  

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Realizar uma reorganização "nulo"

  

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Renomear uma tabela

  

O renomeamento de uma tabela pode ser realizado instantaneamente ou no local. O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Veja a Seção 15.1.41, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de tablespace. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 17.19 Suporte DDL Online para Operações de Tablespace**

<table summary="Suporte DDL online para operações de tablespace indicando se a operação é realizada no local, reconstrui tabelas dentro do tablespace, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operação</th> <th>Instantânea</th> <th>No Local</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadados</th> </tr></thead><tbody><tr> <th>Renomear um tablespace geral</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Habilitar ou desabilitar criptografia de tablespace geral</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Habilitar ou desabilitar criptografia de tablespace por arquivo</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Renomear um tablespace geral




`ALTER TABLESPACE ... RENAME TO` usa o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

* Habilitar ou desabilitar criptografia geral de tablespace

  

  `ALTER TABLESPACE ... ENCRYPTION` usa o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

* Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* Habilitar ou desabilitar criptografia de tablespace por arquivo

  

  Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

#### Operações de Partição

Com exceção de algumas cláusulas de partição de `ALTER TABLE`, as operações de DDL online para tabelas `InnoDB` particionadas seguem as mesmas regras que se aplicam às tabelas regulares `InnoDB` não particionadas.

Algumas cláusulas de partição de `ALTER TABLE` não passam pela mesma API de DDL online interna das tabelas `InnoDB` regulares não particionadas. Como resultado, o suporte online para cláusulas de partição de `ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada declaração de partição de `ALTER TABLE`. Independentemente da API de DDL online usada, o MySQL tenta minimizar a cópia e o bloqueio de dados quando possível.

As opções de partição de `ALTER TABLE` que usam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`” reparam a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela declaração de `ALTER TABLE`, e os dados da tabela são copiados para a nova estrutura da tabela.

**Tabela 17.20 Suporte de DDL Online para Operações de Partição**

<table summary="Suporte DDL online para operações de particionamento, indicando se a operação é realizada in-place e permite DML concorrente">
<col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/>
<thead><tr>
<th>Cláusula de Particionamento</th>
<th>Instantâneo</th>
<th>In-Place</th>
<th>Permite DML</th>
<th>Notas</th>
</tr></thead>
<tbody><tr>
<th><code>PARTITION BY</code></th>
<td>Não</td>
<td>Não</td>
<td>Não</td>
<td>Permite <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td>
</tr><tr>
<th><code>ADD PARTITION</code></th>
<td>Não</td>
<td>Sim*</td>
<td>Sim*</td>
<td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code> é suportado para partições <code>RANGE</code> e <code>LIST</code>, <code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSISVE}</code> para partições <code>HASH</code> e <code>KEY</code>, e <code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code> para todos os tipos de partições. Não copia dados para tabelas particionadas por <code>RANGE</code> ou <code>LIST</code>. Consultas concorrentes são permitidas com <code>ALGORITHM=COPY</code> para tabelas particionadas por <code>HASH</code> ou <code>LIST</code>, pois o MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td>
</tr><tr>
<th><code>DROP PARTITION</code></th>
<td>Não</td>
<td>Sim*</td>
<td>Sim*</td>
<td><p> <code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code> é suportado. Não copia dados para tabelas particionadas por <code>RANGE</code> ou <code>LIST</code>. </p><p> <code>DROP PARTITION</code> com <code>ALGORITHM=INPLACE</code> exclui os dados armazenados na partição e exclui a partição. No entanto, <code>DROP PARTITION</code> com <code>ALGORITHM=COPY</code> ou <code>old_alter_table=ON</code> reconstrui a tabela particionada e tenta mover dados de uma partição excluída para outra partição com uma definição de <code>PARTITION ... VALUES</code> compatível. Os dados que não podem ser movidos para outra partição são excluídos. </p></td>
</tr><tr>
<th><code>DISCARD PARTITION</code></th>
<td>Não</td>
<td>Não</td>
<td>Não</td>
<td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td>
</tr><tr>
<th><code>IMPORT PARTITION</code></th>
<td>Não</td>
<td>Não</td>
<td>Não</td>
<td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td>
</tr><tr>
<th scope="

As operações `ALTER TABLE` online sem particionamento em tabelas particionadas seguem as mesmas regras que se aplicam às tabelas regulares. No entanto, a `ALTER TABLE` executa operações online em cada particionamento da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplas particionamentos.

Para obter informações adicionais sobre as cláusulas de particionamento `ALTER TABLE`, consulte Opções de particionamento e Seção 15.1.11.1, “Operações de particionamento de ALTER TABLE”. Para informações sobre particionamento em geral, consulte o Capítulo 26, *Particionamento*.