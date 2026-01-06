### 14.13.1 Operações de DDL online

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

**Tabela 14.10 Suporte de DDL Online para Operações de Índices**

<table summary="Suporte online para DDL de operações de índice que indica se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Criar ou adicionar um índice secundário</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">A queda de um índice</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Renomear um índice</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Adicionar um índice [[<code class="literal">FULLTEXT</code>]]</th> <td>Sim*</td> <td>Não*</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Adicionar um índice [[<code class="literal">SPATIAL</code>]]</th> <td>Sim</td> <td>Não</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Alterar o tipo de índice</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Criar ou adicionar um índice secundário

  ```sql
  CREATE INDEX name ON table (col_list);
  ```

  ```sql
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo criado. A instrução `CREATE INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

  O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que você pode, geralmente, acelerar o processo geral de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando os índices secundários após o carregamento dos dados.

  Um índice secundário recém-criado contém apenas os dados comprometidos na tabela no momento em que a instrução `CREATE INDEX` ou `ALTER TABLE` terminar de ser executada. Ele não contém quaisquer valores não comprometidos, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do antigo índice.

  Se o servidor sair enquanto estiver criando um índice secundário, na recuperação, o MySQL exclui quaisquer índices parcialmente criados. Você deve executar novamente a instrução `ALTER TABLE` ou `CREATE INDEX`.

  Alguns fatores afetam o desempenho, o uso de espaço e a semântica dessa operação. Para obter detalhes, consulte a Seção 14.13.6, “Limitações do DDL online”.

- A queda de um índice

  ```sql
  DROP INDEX name ON table;
  ```

  ```sql
  ALTER TABLE tbl_name DROP INDEX name;
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo excluído. A instrução `DROP INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

- Renomear um índice

  ```sql
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

- Adicionar um índice `FULLTEXT`

  ```sql
  CREATE FULLTEXT INDEX name ON table(column);
  ```

  A adição do primeiro índice `FULLTEXT` reconstrui a tabela se não houver uma coluna `FTS_DOC_ID` definida pelo usuário. Índices `FULLTEXT` adicionais podem ser adicionados sem a necessidade de reconstruir a tabela.

- Adicionar um índice `SPATIAL`

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

- Alterar o tipo de índice (`USING {BTREE | HASH}`)

  ```sql
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INPLACE;
  ```

#### Operações de Chave Primária

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave primária. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Consulte as Notas de sintaxe e uso.

**Tabela 14.11 Suporte de DDL Online para Operações de Chave Primária**

<table summary="Suporte online para DDL de operações de chave primária, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Adicionar uma chave primária</th> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Remover uma chave primária</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Excluir uma chave primária e adicionar outra</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma chave primária

  ```sql
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara. `ALGORITHM=INPLACE` não é permitido sob certas condições se as colunas tiverem que ser convertidas em `NOT NULL`.

  A reestruturação do índice agrupado sempre requer a cópia dos dados da tabela. Portanto, é melhor definir a chave primária ao criar uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` mais tarde.

  Quando você cria um índice `UNIQUE` ou `PRIMARY KEY`, o MySQL precisa realizar um trabalho adicional. Para índices `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a chave. Para um índice `PRIMARY KEY`, o MySQL também verifica se nenhuma das colunas `PRIMARY KEY` contém um `NULL`.

  Quando você adiciona uma chave primária usando a cláusula `ALGORITHM=COPY`, o MySQL converte os valores `NULL` nas colunas associadas em valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Esse é um comportamento não padrão que a Oracle não recomenda que você confie. Adicionar uma chave primária usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui as flags `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é rigorosa, `ALGORITHM=INPLACE` é permitido, mas a declaração ainda pode falhar se as colunas da chave primária solicitadas contiverem valores `NULL`. O comportamento `ALGORITHM=INPLACE` é mais compatível com o padrão.

  Se você criar uma tabela sem uma chave primária, o `InnoDB` escolhe uma para você, que pode ser a primeira chave `UNIQUE` definida em colunas `NOT NULL` ou uma chave gerada pelo sistema. Para evitar a incerteza e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da instrução `CREATE TABLE`.

  O MySQL cria um novo índice agrupado copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de índice desejada. Uma vez que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome diferente para a tabela temporária. A tabela temporária que compõe o novo índice agrupado é renomeada com o nome da tabela original, e a tabela original é excluída do banco de dados.

  Os aprimoramentos de desempenho online que se aplicam às operações em índices secundários não se aplicam ao índice de chave primária. As linhas de uma tabela InnoDB são armazenadas em um índice agrupado organizado com base na chave primária, formando o que alguns sistemas de banco de dados chamam de "tabela organizada por índice". Como a estrutura da tabela está intimamente ligada à chave primária, redefinir a chave primária ainda requer a cópia dos dados.

  Quando uma operação na chave primária usa `ALGORITHM=INPLACE`, mesmo que os dados ainda estejam sendo copiados, ela é mais eficiente do que usar `ALGORITHM=COPY`, porque:

  - Não é necessário registrar o log de desfazer ou o log de refazer associado ao `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às instruções DDL que usam `ALGORITHM=COPY`.

  - As entradas do índice secundário estão pré-ordenadas e, portanto, podem ser carregadas em ordem.

  - O buffer de alteração não é usado, porque não há inserções de acesso aleatório nos índices secundários.

  Se o servidor sair durante a criação de um novo índice agrupado, os dados não serão perdidos, mas você deve completar o processo de recuperação usando as tabelas temporárias que existem durante o processo. Como é raro recriar um índice agrupado ou redefinir chaves primárias em tabelas grandes ou encontrar um travamento do sistema durante essa operação, este manual não fornece informações sobre como recuperar desse cenário.

- Remover uma chave primária

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

  Apenas o `ALGORITHM=COPY` permite a remoção de uma chave primária sem a adição de uma nova na mesma instrução `ALTER TABLE`.

- Excluir uma chave primária e adicionar outra

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

#### Operações de Coluna

A tabela a seguir fornece uma visão geral do suporte online para operações de DDL de coluna. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.12 Suporte de DDL Online para Operações de Colunas**

<table summary="Suporte online para DDL de operações de coluna que indica se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Adicionar uma coluna</th> <td>Sim</td> <td>Sim</td> <td>Sim*</td> <td>Não</td> </tr><tr> <th scope="row">Excluir uma coluna</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Renomear uma coluna</th> <td>Sim</td> <td>Não</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th scope="row">Rearranjar colunas</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Definir um valor padrão para uma coluna</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Alterar o tipo de dados da coluna</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Extender o tamanho da coluna [[<code class="literal">VARCHAR</code>]]</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Remover o valor padrão da coluna</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Alterar o valor de autoincremento</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não*</td> </tr><tr> <th scope="row">Criando uma coluna [[<code class="literal">NULL</code>]]</th> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Criando uma coluna [[<code class="literal">NOT NULL</code>]]</th> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Modificar a definição de uma coluna [[<code class="literal">ENUM</code>]] ou [[<code class="literal">SET</code>]]</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma coluna

  ```sql
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  A DML concorrente não é permitida ao adicionar uma coluna de autoincremento. Os dados são reorganizados substancialmente, tornando-a uma operação cara. No mínimo, é necessário `ALGORITHM=INPLACE, LOCK=SHARED`.

- Excluir uma coluna

  ```sql
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

- Renomear uma coluna

  ```sql
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Para permitir a DML concorrente, mantenha o mesmo tipo de dados e altere apenas o nome da coluna.

  Quando você mantém o mesmo tipo de dados e o atributo "\[NOT] NULL", apenas alterando o nome da coluna, a operação sempre pode ser realizada online.

  Você também pode renomear uma coluna que faz parte de uma restrição de chave estrangeira. A definição da chave estrangeira é atualizada automaticamente para usar o novo nome da coluna. Renomear uma coluna que participa de uma chave estrangeira só funciona com `ALGORITHM=INPLACE`. Se você usar a cláusula `ALGORITHM=COPY` ou alguma outra condição faz com que a operação use `ALGORITHM=COPY`, a instrução `ALTER TABLE` falha.

  O `ALGORITHM=INPLACE` não é suportado para renomear uma coluna gerada.

- Rearranjar colunas

  Para reorganizar as colunas, use `FIRST` ou `AFTER` nas operações `CHANGE` ou `MODIFY`.

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

- Alterar o tipo de dados da coluna

  ```sql
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

  A alteração do tipo de dados da coluna só é suportada com `ALGORITHM=COPY`.

- Extensão do tamanho da coluna `VARCHAR`

  ```sql
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  O número de bytes de comprimento necessários para uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` de tamanho de 0 a 255 bytes, um byte de comprimento é necessário para codificar o valor. Para colunas `VARCHAR` de tamanho de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, a `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes ou de 256 bytes para um tamanho maior. A `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de um único byte de VARCHAR(255) para VARCHAR(256) usando `ALTER TABLE` in-place retorna este erro:

  ```sql
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Nota

  O comprimento em bytes de uma coluna `VARCHAR` depende do comprimento em bytes do conjunto de caracteres.

  A redução do tamanho do `VARCHAR` usando `ALTER TABLE` in-place não é suportada. A redução do tamanho do `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

- Definir um valor padrão para uma coluna

  ```sql
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Apenas modifica os metadados da tabela. Os valores padrão das colunas são armazenados no arquivo .frm da tabela, e não no dicionário de dados do `InnoDB`.

- Definir um valor padrão para uma coluna

  ```sql
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INPLACE, LOCK=NONE;
  ```

- Alterar o valor de autoincremento

  ```sql
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifica um valor armazenado na memória, não o arquivo de dados.

  Em um sistema distribuído que utiliza replicação ou particionamento, você às vezes redefere o contador de autoincremento de uma tabela para um valor específico. A próxima linha inserida na tabela usa o valor especificado para sua coluna de autoincremento. Você também pode usar essa técnica em um ambiente de data warehousing, onde você periodicamente esvazia todas as tabelas e as carrega novamente e reinicia a sequência de autoincremento a partir do 1.

- Tornar uma coluna `NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-se uma operação cara.

- Tornar uma coluna `NOT NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela no local. O `SQL_MODE` `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` é necessário para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores NULL. O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Veja a Seção 13.1.8, “Instrução ALTER TABLE”. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

- Modificando a definição de uma coluna `ENUM` ou `SET`

  ```sql
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  A modificação da definição de uma coluna `ENUM` ou `SET` adicionando novos membros à lista de valores válidos no *final* da lista pode ser realizada in situ, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a reenumeração dos membros existentes, o que requer uma cópia da tabela.

#### Operações de Colunas Geradas

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna geradas. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.13 Suporte de DDL Online para Operações de Coluna Gerada**

<table summary="Suporte online para DDL de operações de coluna geradas, indicando se a operação é realizada in loco, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Adicionar uma coluna [[<code class="literal">STORED</code>]]</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Modificar a ordem da coluna [[<code class="literal">STORED</code>]]</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Remover uma coluna [[<code class="literal">STORED</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Adicionar uma coluna [[<code class="literal">VIRTUAL</code>]]</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Modificar a ordem da coluna [[<code class="literal">VIRTUAL</code>]]</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Remover uma coluna [[<code class="literal">VIRTUAL</code>]]</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma coluna `STORED`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  `ADD COLUMN` não é uma operação de inserção em tempo real para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor.

- Modificar a ordem da coluna `STORED`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

  Refaz a mesa no local.

- Remover uma coluna `STORED`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a mesa no local.

- Adicionar uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Adicionar uma coluna virtual é uma operação in-place para tabelas não particionadas. No entanto, a adição de uma coluna virtual não pode ser combinada com outras ações de `ALTER TABLE`.

  Adicionar um `VIRTUAL` não é uma operação in-place para tabelas particionadas.

- Modificar a ordem da coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

- Remover uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  A remoção de uma coluna `VIRTUAL` é uma operação in-place para tabelas não particionadas. No entanto, a remoção de uma coluna virtual não pode ser combinada com outras ações `ALTER TABLE`.

  A remoção de um `VIRTUAL` não é uma operação in-place para tabelas particionadas.

#### Operações de Chave Estrangeira

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave estrangeira. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.14 Suporte de DDL Online para Operações de Chave Estrangeira**

<table summary="Suporte online para DDL de operações de chave estrangeira, indicando se a operação é realizada no local, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Adicionar uma restrição de chave estrangeira</th> <td>Sim*</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Excluir uma restrição de chave estrangeira</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Adicionar uma restrição de chave estrangeira

  O algoritmo `INPLACE` é suportado quando `foreign_key_checks` está desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```sql
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

- Excluir uma restrição de chave estrangeira

  ```sql
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

  A eliminação de uma chave estrangeira pode ser realizada online com a opção `foreign_key_checks` habilitada ou desabilitada.

  Se você não conhece os nomes das restrições de chave estrangeira de uma tabela específica, execute a seguinte declaração e encontre o nome da restrição na cláusula `CONSTRAINT` para cada chave estrangeira:

  ```sql
  SHOW CREATE TABLE table\G
  ```

  Ou, consulte a tabela do esquema de informações `TABLE_CONSTRAINTS` e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das chaves estrangeiras.

  Você também pode excluir uma chave estrangeira e seu índice associado em uma única instrução:

  ```sql
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Nota

Se as chaves estrangeiras já estiverem presentes na tabela que está sendo alterada (ou seja, se for uma tabela filha que contém uma cláusula `FOREIGN KEY ... REFERENCE`), restrições adicionais se aplicam às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da chave estrangeira:

- Uma `ALTER TABLE` na tabela filha pode aguardar que outra transação seja confirmada, se uma alteração na tabela pai causar alterações associadas na tabela filha por meio de uma cláusula `ON UPDATE` ou `ON DELETE` usando os parâmetros `CASCADE` ou `SET NULL`.

- Da mesma forma, se uma tabela for a tabela pai em uma relação de chave estrangeira, mesmo que ela não contenha nenhuma cláusula `FOREIGN KEY`, ela pode esperar que a `ALTER TABLE` seja concluída se uma instrução `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela filha.

#### Operações de tabela

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tabela. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.15 Suporte de DDL Online para Operações de Tabela**

<table summary="Suporte online para DDL de operações de tabelas, indicando se a operação é realizada in loco, reconstrui a tabela, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Alterar o [[<code class="literal">ROW_FORMAT</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Alterar o [[<code class="literal">KEY_BLOCK_SIZE</code>]]</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Definir estatísticas persistentes de tabela</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th scope="row">Especificar um conjunto de caracteres</th> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Conversão de um conjunto de caracteres</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>Não</td> </tr><tr> <th scope="row">Otimizando uma tabela</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Reestruturação com a opção [[<code class="literal">FORCE</code>]]</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Realizar uma reconstrução nula</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th scope="row">Renomear uma tabela</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

- Alterar o `ROW_FORMAT`

  ```sql
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

  Para obter informações adicionais sobre a opção `ROW_FORMAT`, consulte Opções de tabela.

- Alterar o `KEY_BLOCK_SIZE`

  ```sql
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados de forma substancial, o que torna a operação cara.

  Para obter informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte Opções de tabela.

- Definir opções de estatísticas de tabela persistentes

  ```sql
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Apenas modifica os metadados da tabela.

  As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para obter mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

- Especificar um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Refaz a tabela se o novo codificação de caracteres for diferente.

- Conversão de um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=COPY;
  ```

  Refaz a tabela se o novo codificação de caracteres for diferente.

- Otimizando uma tabela

  ```sql
  OPTIMIZE TABLE tbl_name;
  ```

  A operação in-place não é suportada para tabelas com índices `FULLTEXT`. A operação usa o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

- Reestruturando uma tabela com a opção `FORCE`

  ```sql
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

- Realizar uma reconstrução "nulo"

  ```sql
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

- Renomear uma tabela

  ```sql
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Veja a Seção 13.1.33, “Instrução RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tablespace. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.16 Suporte de DDL Online para Operações de Tablespace**

<table summary="Suporte online para DDL de operações de tablespace que indicam se a operação é realizada no local, reconstrui tabelas dentro do tablespace, permite DML concorrente ou apenas modifica metadados."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th scope="col">Operação</th> <th scope="col">No lugar</th> <th scope="col">Reestruturar a tabela</th> <th scope="col">Permissões DML concorrentes</th> <th scope="col">Apenas modifica metadados</th> </tr></thead><tbody><tr> <th scope="row">Ativar ou desativar a criptografia do espaço de tabela por arquivo</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr></tbody></table>

##### Observações sobre sintaxe e uso

Ativar ou desativar a criptografia do espaço de tabela por arquivo

```sql
ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
```

A criptografia é suportada apenas para espaços de tabelas por arquivo. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

#### Operações de Partição

Com exceção da maioria das cláusulas de particionamento `ALTER TABLE`, as operações de DDL online para tabelas `InnoDB` particionadas seguem as mesmas regras que se aplicam às tabelas `InnoDB` regulares.

A maioria das cláusulas de particionamento `ALTER TABLE` não passa pela mesma API interna de DDL online que as tabelas regulares `InnoDB` sem particionamento. Como resultado, o suporte online para cláusulas de particionamento `ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada instrução de particionamento `ALTER TABLE`. Independentemente da API de DDL online utilizada, o MySQL tenta minimizar a cópia e o bloqueio de dados sempre que possível.

As opções de particionamento `ALTER TABLE` que utilizam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`” reparam a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela instrução `ALTER TABLE`, e os dados da tabela são copiados para a nova estrutura da tabela.

**Tabela 14.17 Suporte de DDL Online para Operações de Partição**

<table summary="Suporte online para DDL de particionamento que indica se a operação é realizada no local e permite DML concorrente."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th scope="col">Cláusula de Partição</th> <th scope="col">No lugar</th> <th scope="col">Permissões DML</th> <th scope="col">Notas</th> </tr></thead><tbody><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[PH_HTML_CODE_<code class="literal">DROP PARTITION</code>]</a></th> <td>Não</td> <td>Não</td> <td>Permissões [[PH_HTML_CODE_<code class="literal">DROP PARTITION</code>], [[PH_HTML_CODE_<code class="literal">LOCK=DEFAULT</code>]</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[PH_HTML_CODE_<code class="literal">RANGE</code>]</a></th> <td>Não</td> <td>Não</td> <td>Apenas permite permissões [[PH_HTML_CODE_<code class="literal">LIST</code>], [[PH_HTML_CODE_<code class="literal">DISCARD PARTITION</code>]. Não copia dados existentes para tabelas particionadas por [[PH_HTML_CODE_<code class="literal">ALGORITHM=DEFAULT</code>] ou [[PH_HTML_CODE_<code class="literal">LOCK=DEFAULT</code>]. Consultas concorrentes são permitidas para tabelas particionadas por [[PH_HTML_CODE_<code class="literal">IMPORT PARTITION</code>] ou [[PH_HTML_CODE_<code class="literal">ALGORITHM=DEFAULT</code>]. O MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">DROP PARTITION</code>]]</a></th> <td>Não</td> <td>Não</td> <td>Apenas permite permissões [[<code class="literal">ALGORITHM=COPY</code><code class="literal">DROP PARTITION</code>], [[<code class="literal">LOCK=DEFAULT</code>]]. Não copia dados existentes para tabelas particionadas por [[<code class="literal">RANGE</code>]] ou [[<code class="literal">LIST</code>]].</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">DISCARD PARTITION</code>]]</a></th> <td>Não</td> <td>Não</td> <td>Apenas autorizações [[<code class="literal">ALGORITHM=DEFAULT</code>]], [[<code class="literal">LOCK=DEFAULT</code>]]</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">IMPORT PARTITION</code>]]</a></th> <td>Não</td> <td>Não</td> <td>Apenas autorizações [[<code class="literal">ALGORITHM=DEFAULT</code>]], [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">DROP PARTITION</code>]</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">DROP PARTITION</code>]</a></th> <td>Sim</td> <td>Sim</td> <td>Não copia dados existentes. Ele apenas exclui linhas; ele não altera a definição da própria tabela ou de qualquer uma de suas partições.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">LOCK=DEFAULT</code>]</a></th> <td>Não</td> <td>Não</td> <td>Apenas permitem-se as permissões [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">RANGE</code>], [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">LIST</code>]. Consultas concorrentes são permitidas para tabelas particionadas por [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">DISCARD PARTITION</code>] ou [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">ALGORITHM=DEFAULT</code>], pois o MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">LOCK=DEFAULT</code>]</a></th> <td>Não</td> <td>Não</td> <td>Apenas os permissões [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">IMPORT PARTITION</code>], [[<code class="literal">LOCK={DEFAULT|SHARED|EXCLUSIVE}</code><code class="literal">ALGORITHM=DEFAULT</code>] são permitidas. Consultas concorrentes são permitidas para tabelas particionadas por [[<code class="literal">ADD PARTITION</code><code class="literal">DROP PARTITION</code>] ou [[<code class="literal">ADD PARTITION</code><code class="literal">DROP PARTITION</code>]. O MySQL copia os dados das partições afetadas enquanto mantém uma trava de metadados compartilhada.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ADD PARTITION</code><code class="literal">LOCK=DEFAULT</code>]</a></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ADD PARTITION</code><code class="literal">RANGE</code>]</a></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ADD PARTITION</code><code class="literal">LIST</code>]</a></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ADD PARTITION</code><code class="literal">DISCARD PARTITION</code>]</a></th> <td>Não</td> <td>Não</td> <td>As cláusulas [[<code class="literal">ADD PARTITION</code><code class="literal">ALGORITHM=DEFAULT</code>] e [[<code class="literal">ADD PARTITION</code><code class="literal">LOCK=DEFAULT</code>] são ignoradas. Reconstrói toda a tabela. Veja<a class="xref" href="partitioning-maintenance.html" title="22.3.4 Manutenção de Partições">Seção 22.3.4, “Manutenção de Partições”</a>.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ADD PARTITION</code><code class="literal">IMPORT PARTITION</code>]</a></th> <td>Não</td> <td>Não</td> <td>Apenas permitem-se permissões [[<code class="literal">ADD PARTITION</code><code class="literal">ALGORITHM=DEFAULT</code>], [[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">DROP PARTITION</code>]. Consultas concorrentes são permitidas para tabelas particionadas por [[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">DROP PARTITION</code>] ou [[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">LOCK=DEFAULT</code>]. O MySQL copia os dados das partições afetadas enquanto mantém uma trava de metadados compartilhada.</td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">RANGE</code>]</a></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th scope="row"><a class="link" href="alter-table.html" title="13.1.8 Declaração ALTER TABLE">[[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">LIST</code>]</a></th> <td>Não</td> <td>Não</td> <td>Permissões [[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">DISCARD PARTITION</code>], [[<code class="literal">ALGORITHM=DEFAULT</code><code class="literal">ALGORITHM=DEFAULT</code>]</td> </tr></tbody></table>

As operações `ALTER TABLE` online sem particionamento em tabelas particionadas seguem as mesmas regras que se aplicam às tabelas regulares. No entanto, o `ALTER TABLE` executa operações online em cada partição da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplas partições.

Para obter informações adicionais sobre as cláusulas de particionamento `ALTER TABLE`, consulte Opções de particionamento e Seção 13.1.8.1, “Operações de particionamento de tabelas ALTER”. Para informações sobre particionamento em geral, consulte o Capítulo 22, *Particionamento*.
