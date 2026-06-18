### 17.12.1 Operações de DDL online

Detalhes de suporte online, exemplos de sintaxe e notas de uso para operações DDL estão disponíveis nos tópicos a seguir nesta seção.

- Operações de índice
- Operações de Chave Primária
- Operações de Coluna
- Operações de Colunas Geradas
- Operações de Chave Estrangeira
- Operações de tabela
- Operações de Tablespace
- Operações de Partição

#### Operações de índice

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de índice. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.16 Suporte de DDL Online para Operações de Índices**

<table summary="Suporte online para DDL de operações de índice que indica se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Criar ou adicionar um índice secundário</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>A queda de um índice</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Renomear um índice</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Adicionar um índice [[<code>FULLTEXT</code>]]</th> <td>Não</td> <td>Sim*</td> <td>Não*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Adicionar um índice [[<code>SPATIAL</code>]]</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Alterar o tipo de índice</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Criar ou adicionar um índice secundário

  ```
  CREATE INDEX name ON table (col_list);
  ```

  ```
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo criado. A instrução `CREATE INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

  O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que você pode, geralmente, acelerar o processo geral de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando os índices secundários após o carregamento dos dados.

  Um índice secundário recém-criado contém apenas os dados comprometidos na tabela no momento em que a instrução `CREATE INDEX` ou `ALTER TABLE` termina de ser executada. Ele não contém quaisquer valores não comprometidos, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do índice antigo.

  Alguns fatores afetam o desempenho, o uso de espaço e a semântica dessa operação. Para obter detalhes, consulte a Seção 17.12.8, “Limitações do DDL online”.

- A queda de um índice

  ```
  DROP INDEX name ON table;
  ```

  ```
  ALTER TABLE tbl_name DROP INDEX name;
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo excluído. A instrução `DROP INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

- Renomear um índice

  ```
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

- Adicionar um índice `FULLTEXT`

  ```
  CREATE FULLTEXT INDEX name ON table(column);
  ```

  A adição do primeiro índice `FULLTEXT` reconstrui a tabela se não houver uma coluna `FTS_DOC_ID` definida pelo usuário. Índices adicionais `FULLTEXT` podem ser adicionados sem a necessidade de reconstruir a tabela.

- Adicionar um índice `SPATIAL`

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

- Alterar o tipo de índice (`USING {BTREE | HASH}`)

  ```
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INSTANT;
  ```

#### Operações de Chave Primária

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave primária. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Consulte as Notas de sintaxe e uso.

**Tabela 17.17 Suporte de DDL Online para Operações de Chave Primária**

<table summary="Suporte online para DDL de operações de chave primária, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma chave primária</th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Remover uma chave primária</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Excluir uma chave primária e adicionar outra</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma chave primária

  ```
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-se uma operação cara. `ALGORITHM=INPLACE` não é permitido sob certas condições, se as colunas tiverem que ser convertidas para `NOT NULL`.

  A reestruturação do índice agrupado sempre requer a cópia dos dados da tabela. Portanto, é melhor definir a chave primária ao criar uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` mais tarde.

  Quando você cria um índice `UNIQUE` ou `PRIMARY KEY`, o MySQL precisa realizar um trabalho adicional. Para índices `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a chave. Para um índice `PRIMARY KEY`, o MySQL também verifica se nenhuma das colunas `PRIMARY KEY` contém um `NULL`.

  Quando você adiciona uma chave primária usando a cláusula `ALGORITHM=COPY`, o MySQL converte os valores de `NULL` nas colunas associadas em valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Esse é um comportamento não padrão que a Oracle recomenda que você não confie. Adicionar uma chave primária usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui as bandeiras `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é rigorosa, `ALGORITHM=INPLACE` é permitido, mas a declaração ainda pode falhar se as colunas da chave primária solicitadas contiverem valores de `NULL`. O comportamento de `ALGORITHM=INPLACE` é mais compatível com o padrão.

  Se você criar uma tabela sem uma chave primária, o `InnoDB` escolhe uma para você, que pode ser a primeira chave `UNIQUE` definida nas colunas `NOT NULL`, ou uma chave gerada pelo sistema. Para evitar a incerteza e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da declaração `CREATE TABLE`.

  O MySQL cria um novo índice agrupado copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de índice desejada. Uma vez que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome diferente para a tabela temporária. A tabela temporária que compõe o novo índice agrupado é renomeada com o nome da tabela original, e a tabela original é excluída do banco de dados.

  Os aprimoramentos de desempenho online que se aplicam às operações em índices secundários não se aplicam ao índice de chave primária. As linhas de uma tabela InnoDB são armazenadas em um índice agrupado organizado com base na chave primária, formando o que alguns sistemas de banco de dados chamam de "tabela organizada por índice". Como a estrutura da tabela está intimamente ligada à chave primária, redefinir a chave primária ainda requer a cópia dos dados.

  Quando uma operação na chave primária usa `ALGORITHM=INPLACE`, mesmo que os dados ainda estejam copiados, é mais eficiente do que usar `ALGORITHM=COPY`, porque:

  - Não é necessário registro de desfazer ou registro de redo associado para `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às declarações DDL que usam `ALGORITHM=COPY`.

  - As entradas do índice secundário estão pré-ordenadas e, portanto, podem ser carregadas em ordem.

  - O buffer de alteração não é usado, porque não há inserções de acesso aleatório nos índices secundários.

- Remover uma chave primária

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

  Apenas o `ALGORITHM=COPY` permite a remoção de uma chave primária sem a adição de uma nova na mesma instrução `ALTER TABLE`.

- Excluir uma chave primária e adicionar outra

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

#### Operações de Coluna

A tabela a seguir fornece uma visão geral do suporte online para operações de DDL de coluna. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.18 Suporte de DDL Online para Operações de Colunas**

<table summary="Suporte online para DDL de operações de coluna que indica se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Não*</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th>Excluir uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Renomear uma coluna</th> <td>Sim*</td> <td>Sim</td> <td>Não</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th>Rearranjar colunas</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Definir um valor padrão para uma coluna</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o tipo de dados da coluna</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Extender o tamanho da coluna [[<code>VARCHAR</code>]]</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Remover o valor padrão da coluna</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o valor de autoincremento</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não*</td> </tr><tr> <th>Criando uma coluna [[<code>NULL</code>]]</th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Criando uma coluna [[<code>NOT NULL</code>]]</th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Modificar a definição de uma coluna [[<code>ENUM</code>]] ou [[<code>SET</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma coluna

  ```
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INSTANT;
  ```

  `INSTANT` é o algoritmo padrão a partir do MySQL 8.0.12 e `INPLACE` antes disso.

  As seguintes limitações se aplicam quando o algoritmo `INSTANT` adiciona uma coluna:

  - Uma declaração não pode combinar a adição de uma coluna com outras ações `ALTER TABLE` que não suportam o algoritmo `INSTANT`.

  - O algoritmo `INSTANT` pode adicionar uma coluna em qualquer posição da tabela. Antes do MySQL 8.0.29, o algoritmo `INSTANT` só podia adicionar uma coluna como a última coluna da tabela.

  - As colunas não podem ser adicionadas a tabelas que usam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. As tabelas temporárias só suportam `ALGORITHM=COPY`.

  - O MySQL verifica o tamanho da linha quando o algoritmo `INSTANT` adiciona uma coluna e lança o seguinte erro se a adição exceder o limite.

    ERRO 4092 (HY000): A coluna não pode ser adicionada com ALGORITHM=INSTANT, pois, após isso, o tamanho máximo de linha possível excede o tamanho máximo permitido. Tente ALGORITHM=INPLACE/COPY.

    Antes do MySQL 8.0.29, o MySQL não verifica o tamanho da linha quando o algoritmo `INSTANT` adiciona uma coluna. No entanto, o MySQL verifica o tamanho da linha durante operações DML que inserem e atualizam linhas na tabela.

  - O número máximo de colunas na representação interna da tabela não pode exceder 1022 após a adição de colunas com o algoritmo `INSTANT`. A mensagem de erro é:

    ERRO 4158 (HY000): A coluna não pode ser adicionada a `tbl_name` com ALGORITHM=INSTANT. Tente ALGORITHM=INPLACE/COPY

  - O algoritmo `INSTANT` não pode adicionar ou excluir colunas em tabelas do esquema do sistema, como a tabela interna `mysql`. Essa limitação foi adicionada no MySQL 8.0.29.

  - Uma coluna com um índice funcional não pode ser excluída usando o algoritmo `INSTANT`.

  Várias colunas podem ser adicionadas na mesma declaração `ALTER TABLE`. Por exemplo:

  ```
  ALTER TABLE t1 ADD COLUMN c2 INT, ADD COLUMN c3 INT, ALGORITHM=INSTANT;
  ```

  Uma nova versão da linha é criada após cada operação `ALTER TABLE ... ALGORITHM=INSTANT` que adiciona uma ou mais colunas, exclui uma ou mais colunas ou adiciona e exclui uma ou mais colunas na mesma operação. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` rastreia o número de versões da linha para uma tabela. O valor é incrementado sempre que uma coluna é adicionada ou excluída instantaneamente. O valor inicial é 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

  Quando uma tabela com colunas adicionadas ou removidas instantaneamente é reconstruída pela operação de reconstrução de tabela `ALTER TABLE` ou `OPTIMIZE TABLE`, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões de linha permitidas é de 64, pois cada versão de linha requer espaço adicional para os metadados da tabela. Quando o limite de versões de linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` que utilizam `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

  ERRO 4092 (HY000): Versões máximas de linhas alcançadas para a tabela test/t1. Não é possível adicionar ou excluir colunas instantaneamente. Use a opção COPY/INPLACE.

  As seguintes colunas `INFORMATION_SCHEMA` fornecem metadados adicionais para colunas adicionadas instantaneamente. Consulte as descrições dessas colunas para obter mais informações. Veja a Seção 28.4.9, “A Tabela INFORMATION\_SCHEMA INNODB\_COLUMNS”, e a Seção 28.4.23, “A Tabela INFORMATION\_SCHEMA INNODB\_TABLES”.

  - `INNODB_COLUMNS.DEFAULT_VALUE`
  - `INNODB_COLUMNS.HAS_DEFAULT`
  - `INNODB_TABLES.INSTANT_COLS`

  A DML concorrente não é permitida ao adicionar uma coluna de autoincremento. Os dados são reorganizados substancialmente, tornando-a uma operação cara. No mínimo, é necessário `ALGORITHM=INPLACE, LOCK=SHARED`.

  A tabela é reconstruída se `ALGORITHM=INPLACE` for usado para adicionar uma coluna.

- Excluir uma coluna

  ```
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INSTANT;
  ```

  `INSTANT` é o algoritmo padrão a partir do MySQL 8.0.29 e `INPLACE` antes disso.

  As seguintes limitações se aplicam quando o algoritmo `INSTANT` é usado para excluir uma coluna:

  - A remoção de uma coluna não pode ser combinada na mesma instrução com outras ações `ALTER TABLE` que não suportam `ALGORITHM=INSTANT`.

  - As colunas não podem ser excluídas de tabelas que utilizam `ROW_FORMAT=COMPRESSED`, tabelas com um índice `FULLTEXT`, tabelas que residem no espaço de tabelas do dicionário de dados ou tabelas temporárias. As tabelas temporárias só suportam `ALGORITHM=COPY`.

  Várias colunas podem ser excluídas na mesma declaração `ALTER TABLE`; por exemplo:

  ```
  ALTER TABLE t1 DROP COLUMN c4, DROP COLUMN c5, ALGORITHM=INSTANT;
  ```

  Cada vez que uma coluna é adicionada ou removida usando `ALGORITHM=INSTANT`, uma nova versão da linha é criada. A coluna `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` registra o número de versões da linha para uma tabela. O valor é incrementado cada vez que uma coluna é adicionada ou removida instantaneamente. O valor inicial é 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

  Quando uma tabela com colunas adicionadas ou removidas instantaneamente é reconstruída pela operação de reconstrução de tabela `ALTER TABLE` ou `OPTIMIZE TABLE`, o valor `TOTAL_ROW_VERSIONS` é redefinido para 0. O número máximo de versões de linha permitidas é de 64, pois cada versão de linha requer espaço adicional para os metadados da tabela. Quando o limite de versões de linha é atingido, as operações `ADD COLUMN` e `DROP COLUMN` que utilizam `ALGORITHM=INSTANT` são rejeitadas com uma mensagem de erro que recomenda a reconstrução da tabela usando o algoritmo `COPY` ou `INPLACE`.

  ERRO 4092 (HY000): Versões máximas de linhas alcançadas para a tabela test/t1. Não é possível adicionar ou excluir colunas instantaneamente. Use a opção COPY/INPLACE.

  Se for usado um algoritmo diferente do `ALGORITHM=INSTANT`, os dados são reorganizados de forma substancial, tornando-se uma operação cara.

- Renomear uma coluna

  ```
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INSTANT;
  ```

  O suporte `ALGORITHM=INSTANT` para renomear uma coluna foi adicionado no MySQL 8.0.28. Releases anteriores do MySQL Server só suportam `ALGORITHM=INPLACE` e `ALGORITHM=COPY` ao renomear uma coluna.

  Para permitir a DML concorrente, mantenha o mesmo tipo de dados e altere apenas o nome da coluna.

  Quando você mantém o mesmo tipo de dados e o atributo `[NOT] NULL`, apenas alterando o nome da coluna, a operação sempre pode ser realizada online.

  Renomear uma coluna referenciada de outra tabela só é permitido com `ALGORITHM=INPLACE`. Se você usar `ALGORITHM=INSTANT`, `ALGORITHM=COPY` ou alguma outra condição que faça com que a operação use esses algoritmos, a instrução `ALTER TABLE` falhará.

  `ALGORITHM=INSTANT` suporta o renomeamento de uma coluna virtual; `ALGORITHM=INPLACE`

  `ALGORITHM=INSTANT` e `ALGORITHM=INPLACE` não suportam renomear uma coluna ao adicionar ou remover uma coluna virtual na mesma instrução. Nesse caso, apenas `ALGORITHM=COPY` é suportado.

- Rearranjar colunas

  Para reorganizar as colunas, use `FIRST` ou `AFTER` nas operações `CHANGE` ou `MODIFY`.

  ```
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

- Alterar o tipo de dados da coluna

  ```
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

  A alteração do tipo de dados da coluna só é suportada com `ALGORITHM=COPY`.

- Extender o tamanho da coluna `VARCHAR`

  ```
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  O número de bytes de comprimento necessários para uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` de 0 a 255 bytes de tamanho, um byte de comprimento é necessário para codificar o valor. Para colunas `VARCHAR` de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, o `ALTER TABLE` in-place suporta apenas o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` in-place não suporta o aumento do tamanho da coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de um único byte de VARCHAR(255) para VARCHAR(256) usando `ALTER TABLE` in-place retorna este erro:

  ```
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Nota

  O comprimento em bytes de uma coluna `VARCHAR` depende do comprimento em bytes do conjunto de caracteres.

  A redução do tamanho de `VARCHAR` usando `ALTER TABLE` em local não é suportada. A redução do tamanho de `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

- Definir um valor padrão para uma coluna

  ```
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INSTANT;
  ```

  Apenas modifica os metadados da tabela. Os valores padrão das colunas são armazenados no dicionário de dados.

- Definir um valor padrão para uma coluna

  ```
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INSTANT;
  ```

- Alterar o valor de autoincremento

  ```
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifica um valor armazenado na memória, não o arquivo de dados.

  Em um sistema distribuído que utiliza replicação ou particionamento, você às vezes redefere o contador de autoincremento de uma tabela para um valor específico. A próxima linha inserida na tabela usa o valor especificado para sua coluna de autoincremento. Você também pode usar essa técnica em um ambiente de data warehousing, onde você periodicamente esvazia todas as tabelas e as carrega novamente e reinicia a sequência de autoincremento a partir do 1.

- Criando uma coluna `NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-se uma operação cara.

- Criando uma coluna `NOT NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` `SQL_MODE` é necessário para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores NULL. O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Veja a Seção 15.1.9, “Instrução ALTER TABLE”. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

- Modificar a definição de uma coluna `ENUM` ou `SET`

  ```
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INSTANT;
  ```

  A modificação da definição de uma coluna `ENUM` ou `SET` adicionando novos membros da enumeração ou conjunto ao *final* da lista de valores de membro válidos pode ser realizada instantaneamente ou in loco, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a reenumeração dos membros existentes, o que requer uma cópia da tabela.

#### Operações de Colunas Geradas

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna geradas. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.19 Suporte de DDL Online para Operações de Coluna Gerada**

<table summary="Suporte online para DDL de operações de coluna geradas, indicando se a operação é realizada in loco, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna [[<code>STORED</code>]]</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Modificar a ordem da coluna [[<code>STORED</code>]]</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna [[<code>STORED</code>]]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Adicionar uma coluna [[<code>VIRTUAL</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Modificar a ordem da coluna [[<code>VIRTUAL</code>]]</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna [[<code>VIRTUAL</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma coluna `STORED`

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  `ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor.

- Modificar a ordem da coluna `STORED`

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

  Refaz a mesa no local.

- Remover uma coluna `STORED`

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a mesa no local.

- Adicionar uma coluna `VIRTUAL`

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INSTANT;
  ```

  A adição de uma coluna virtual pode ser realizada instantaneamente ou no local para tabelas não particionadas.

  Adicionar um `VIRTUAL` não é uma operação in-place para tabelas particionadas.

- Modificar a ordem da coluna `VIRTUAL`

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

- Remover uma coluna `VIRTUAL`

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INSTANT;
  ```

  A remoção de uma coluna `VIRTUAL` pode ser realizada instantaneamente ou no local para tabelas não particionadas.

#### Operações de Chave Estrangeira

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave estrangeira. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.20 Suporte de DDL Online para Operações de Chave Estrangeira**

<table summary="Suporte online para DDL de operações de chave estrangeira, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Adicionar uma restrição de chave estrangeira</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Excluir uma restrição de chave estrangeira</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma restrição de chave estrangeira

  O algoritmo `INPLACE` é suportado quando o `foreign_key_checks` está desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

- Excluir uma restrição de chave estrangeira

  ```
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

  A eliminação de uma chave estrangeira pode ser realizada online com a opção `foreign_key_checks` habilitada ou desabilitada.

  Se você não conhece os nomes das restrições de chave estrangeira de uma tabela específica, execute a seguinte declaração e encontre o nome da restrição na cláusula `CONSTRAINT` para cada chave estrangeira:

  ```
  SHOW CREATE TABLE table\G
  ```

  Ou, consulte a tabela Schema de Informações `TABLE_CONSTRAINTS` e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das chaves estrangeiras.

  Você também pode excluir uma chave estrangeira e seu índice associado em uma única instrução:

  ```
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Nota

Se as chaves estrangeiras já estiverem presentes na tabela que está sendo alterada (ou seja, se for uma tabela filha que contém uma cláusula `FOREIGN KEY ... REFERENCE`), restrições adicionais se aplicam às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da chave estrangeira:

- Um `ALTER TABLE` na tabela de filhos poderia aguardar a conclusão de outra transação, se uma alteração na tabela pai causar alterações associadas na tabela de filhos por meio de uma cláusula `ON UPDATE` ou `ON DELETE` usando os parâmetros `CASCADE` ou `SET NULL`.

- Da mesma forma, se uma tabela for a tabela pai em uma relação de chave estrangeira, mesmo que ela não contenha nenhuma cláusula `FOREIGN KEY`, ela pode esperar que o `ALTER TABLE` seja concluído se uma instrução `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela filha.

#### Operações de tabela

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tabela. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 17.21 Suporte de DDL Online para Operações de Tabela**

<table summary="Suporte online para DDL de operações de tabelas, indicando se a operação é realizada in loco, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Alterar o [[<code>ROW_FORMAT</code>]]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Alterar o [[<code>KEY_BLOCK_SIZE</code>]]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Definir estatísticas persistentes de tabela</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Especificar um conjunto de caracteres</th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Conversão de um conjunto de caracteres</th> <td>Não</td> <td>Sim</td> <td>Sim*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Otimizando uma tabela</th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Reestruturação com a opção [[<code>FORCE</code>]]</th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Realizar uma reconstrução nula</th> <td>Não</td> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Renomear uma tabela</th> <td>Sim</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Alterar o `ROW_FORMAT`

  ```
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

  Para obter informações adicionais sobre a opção `ROW_FORMAT`, consulte Opções de tabela.

- Alterar o `KEY_BLOCK_SIZE`

  ```
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

  Para obter informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte Opções de tabela.

- Definir opções de estatísticas de tabela persistentes

  ```
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Apenas modifica os metadados da tabela.

  As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para mais informações, consulte a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas do Optimizer Persistente”.

- Especificar um conjunto de caracteres

  ```
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela se o novo codificação de caracteres for diferente.

- Conversão de um conjunto de caracteres

  ```
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela se o novo codificação de caracteres for diferente.

- Otimizando uma tabela

  ```
  OPTIMIZE TABLE tbl_name;
  ```

  A operação in-place não é suportada para tabelas com índices `FULLTEXT`. A operação usa o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

- Reestruturando uma tabela com a opção `FORCE`

  ```
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

- Realizar uma reconstrução "nulo"

  ```
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

- Renomear uma tabela

  ```
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INSTANT;
  ```

  O renomeamento de uma tabela pode ser feito instantaneamente ou no local. O MySQL renomeia os arquivos que correspondem à tabela `tbl_name` sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Veja a Seção 15.1.36, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tablespace. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 17.22 Suporte de DDL Online para Operações de Tablespace**

<table summary="Suporte online para DDL de operações de tablespace que indicam se a operação é realizada no local, reconstrui tabelas dentro do tablespace, permite DML concorrente ou apenas modifica metadados."><thead><tr> <th scope="col">Operação</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th>Renomear um espaço de tabela geral</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Ativar ou desativar a criptografia de espaço de tabela geral</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Ativar ou desativar a criptografia do espaço de tabela por arquivo</th> <td>Não</td> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Renomear um espaço de tabela geral

  ```
  ALTER TABLESPACE tablespace_name RENAME TO new_tablespace_name;
  ```

  O `ALTER TABLESPACE ... RENAME TO` utiliza o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

- Ativar ou desativar a criptografia de espaço de tabela geral

  ```
  ALTER TABLESPACE tablespace_name ENCRYPTION='Y';
  ```

  O `ALTER TABLESPACE ... ENCRYPTION` utiliza o algoritmo `INPLACE`, mas não suporta a cláusula `ALGORITHM`.

  Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

- Ativar ou desativar a criptografia do espaço de tabela por arquivo

  ```
  ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
  ```

  Para informações relacionadas, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

#### Operações de Partição

Com exceção de algumas cláusulas de particionamento `ALTER TABLE`, as operações DDL online para tabelas particionadas `InnoDB` seguem as mesmas regras que se aplicam às tabelas regulares `InnoDB`.

Algumas cláusulas de particionamento `ALTER TABLE` não passam pela mesma API interna de DDL online que as tabelas regulares não particionadas `InnoDB`. Como resultado, o suporte online para cláusulas de particionamento `ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada declaração de particionamento `ALTER TABLE`. Independentemente da API de DDL online utilizada, o MySQL tenta minimizar a cópia e o bloqueio de dados sempre que possível.

As opções de particionamento `ALTER TABLE` que utilizam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, reparam a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela instrução `ALTER TABLE`, e os dados da tabela são copiados para a nova estrutura da tabela.

**Tabela 17.23 Suporte de DDL Online para Operações de Partição**

<table summary="Suporte online para DDL em operações de particionamento, indicando se a operação é realizada in loco e permite DML concorrente."><thead><tr> <th scope="col">Cláusula de Partição</th> <th scope="col">Imediato</th> <th scope="col">No lugar</th> <th scope="col">Permissões DML</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Permissões [[PH_HTML_CODE_<code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>], [[PH_HTML_CODE_<code>LIST</code>]</td> </tr><tr> <th>[[PH_HTML_CODE_<code>ALGORITHM=COPY</code>]</th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td>O [[PH_HTML_CODE_<code>HASH</code>] é suportado para as partições [[PH_HTML_CODE_<code>LIST</code>] e [[PH_HTML_CODE_<code>DROP PARTITION</code>], o [[PH_HTML_CODE_<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code>] para as partições [[PH_HTML_CODE_<code>RANGE</code>] e [[PH_HTML_CODE_<code>LIST</code>], e o [[<code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>]] para todos os tipos de partições. Não copia dados existentes para tabelas particionadas por [[<code>ALGORITHM=COPY</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>] ou [[<code>LIST</code>]]. Consultas concorrentes são permitidas com o [[<code>ALGORITHM=COPY</code>]] para tabelas particionadas por [[<code>HASH</code>]] ou [[<code>LIST</code>]], pois o MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th>[[<code>DROP PARTITION</code>]]</th> <td>Não</td> <td>Sim*</td> <td>Sim*</td> <td><p>O [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code>]] é suportado. Não copia dados para tabelas particionadas por [[<code>RANGE</code>]] ou [[<code>LIST</code>]].</p><p>[[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>] com [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>] exclui os dados armazenados na partição e elimina a partição. No entanto, [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>LIST</code>] com [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>ALGORITHM=COPY</code>] ou [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>HASH</code>] reconstrui a tabela particionada e tenta mover os dados da partição eliminada para outra partição com uma definição de [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>LIST</code>] compatível. Os dados que não podem ser movidos para outra partição são excluídos.</p></td> </tr><tr> <th>[[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>DROP PARTITION</code>]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Apenas autorizações [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code>], [[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>RANGE</code>]</td> </tr><tr> <th>[[<code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code>LIST</code>]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Apenas autorizações [[<code>ADD PARTITION</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>], [[<code>ADD PARTITION</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>]</td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>LIST</code>]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td>Não copia dados existentes. Ele apenas exclui linhas; ele não altera a definição da própria tabela ou de qualquer uma de suas partições.</td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>ALGORITHM=COPY</code>]</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>É suportado [[<code>ADD PARTITION</code><code>HASH</code>].</td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>LIST</code>]</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>É suportado [[<code>ADD PARTITION</code><code>DROP PARTITION</code>].</td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code>]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>RANGE</code>]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th>[[<code>ADD PARTITION</code><code>LIST</code>]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th>[[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>As cláusulas [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code>] e [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>LIST</code>] são ignoradas. Reconstrói toda a tabela. Veja a Seção 26.3.4, “Manutenção de Partições”.</td> </tr><tr> <th>[[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>ALGORITHM=COPY</code>]</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>É suportado [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>HASH</code>].</td> </tr><tr> <th>[[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>LIST</code>]</th> <td>Não</td> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th>[[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>DROP PARTITION</code>]</th> <td>Não</td> <td>Não</td> <td>Não</td> <td>Permissões [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code>], [[<code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code><code>RANGE</code>]</td> </tr></tbody></table>

As operações online sem particionamento `ALTER TABLE` em tabelas particionadas seguem as mesmas regras que se aplicam às tabelas regulares. No entanto, `ALTER TABLE` realiza operações online em cada particionamento da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplas particionamentos.

Para obter informações adicionais sobre as cláusulas de particionamento `ALTER TABLE`, consulte Opções de particionamento e a Seção 15.1.9.1, “Operações de particionamento de Tabela ALTER”. Para informações sobre particionamento em geral, consulte o Capítulo 26, *Particionamento*.
