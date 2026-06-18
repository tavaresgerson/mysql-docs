### 14.13.1 Operações Online de DDL

Os detalhes de suporte online, exemplos de sintaxe e notas de uso para operações DDL são fornecidos sob os seguintes tópicos nesta seção.

* Operações de Index
* Operações de Primary Key
* Operações de Coluna
* Operações de Coluna Gerada
* Operações de Foreign Key
* Operações de Tabela
* Operações de Tablespace
* Operações de Particionamento

#### Operações de Index

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de Index. Um asterisco indica informação adicional, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.10 Suporte DDL Online para Operações de Index**

<table summary="Suporte DDL online para operações de index, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Criar ou adicionar um Secondary Index</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Remover um Index (Dropping an index)</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Renomear um Index</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Adicionar um Index <code>FULLTEXT</code></th> <td>Sim*</td> <td>Não*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Adicionar um Index <code>SPATIAL</code></th> <td>Sim</td> <td>Não</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Alterar o tipo de Index</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Criar ou adicionar um Secondary Index

  ```sql
  CREATE INDEX name ON table (col_list);
  ```

  ```sql
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o Index está sendo criado. A instrução `CREATE INDEX` só é concluída após todas as transactions que estão acessando a tabela terminarem, para que o estado inicial do Index reflita o conteúdo mais recente da tabela.

  O suporte DDL online para adicionar Secondary Indexes significa que você pode geralmente acelerar o processo geral de criação e carregamento de uma tabela e Indexes associados, criando a tabela sem Secondary Indexes e, em seguida, adicionando os Secondary Indexes após o carregamento dos dados.

  Um Secondary Index recém-criado contém apenas os dados commitados na tabela no momento em que a instrução `CREATE INDEX` ou `ALTER TABLE` termina a execução. Ele não contém quaisquer valores não commitados, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do Index antigo.

  Se o servidor sair enquanto estiver criando um Secondary Index, após a recuperação, o MySQL remove quaisquer Indexes parcialmente criados. Você deve executar novamente a instrução `ALTER TABLE` ou `CREATE INDEX`.

  Alguns fatores afetam o desempenho, o uso de espaço e a semântica desta operação. Para detalhes, consulte Seção 14.13.6, “Online DDL Limitations”.

* Remover um Index (Dropping an index)

  ```sql
  DROP INDEX name ON table;
  ```

  ```sql
  ALTER TABLE tbl_name DROP INDEX name;
  ```

  A tabela permanece disponível para operações de leitura e escrita enquanto o Index está sendo removido. A instrução `DROP INDEX` só é concluída após todas as transactions que estão acessando a tabela terminarem, para que o estado inicial do Index reflita o conteúdo mais recente da tabela.

* Renomear um Index

  ```sql
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adicionar um Index `FULLTEXT`

  ```sql
  CREATE FULLTEXT INDEX name ON table(column);
  ```

  Adicionar o primeiro Index `FULLTEXT` reconstrói a tabela se não houver uma coluna `FTS_DOC_ID` definida pelo usuário. Indexes `FULLTEXT` adicionais podem ser incluídos sem reconstruir a tabela.

* Adicionar um Index `SPATIAL`

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Alterar o tipo de Index (`USING {BTREE | HASH}`)

  ```sql
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INPLACE;
  ```

#### Operações de Primary Key

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de Primary Key. Um asterisco indica informação adicional, uma exceção ou uma dependência. Consulte Sintaxe e Notas de Uso.

**Tabela 14.11 Suporte DDL Online para Operações de Primary Key**

<table summary="Suporte DDL online para operações de primary key, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Adicionar uma Primary Key</th> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Remover uma Primary Key</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma Primary Key e adicionar outra</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Adicionar uma Primary Key

  ```sql
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local. Os dados são reorganizados substancialmente, tornando esta uma operação custosa. `ALGORITHM=INPLACE` não é permitido sob certas condições se colunas precisarem ser convertidas para `NOT NULL`.

  A reestruturação do Clustered Index sempre requer a cópia dos dados da tabela. Assim, é melhor definir a Primary Key ao criar uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` posteriormente.

  Ao criar um Index `UNIQUE` ou `PRIMARY KEY`, o MySQL deve realizar algum trabalho extra. Para Indexes `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a Key. Para um Index `PRIMARY KEY`, o MySQL também verifica se nenhuma das colunas da `PRIMARY KEY` contém um valor `NULL`.

  Ao adicionar uma Primary Key usando a cláusula `ALGORITHM=COPY`, o MySQL converte valores `NULL` nas colunas associadas para valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Este é um comportamento não padrão que a Oracle recomenda que você não utilize. Adicionar uma Primary Key usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui os flags `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é estrita, `ALGORITHM=INPLACE` é permitido, mas a instrução ainda pode falhar se as colunas da Primary Key solicitada contiverem valores `NULL`. O comportamento de `ALGORITHM=INPLACE` é mais compatível com o padrão.

  Se você criar uma tabela sem uma Primary Key, o `InnoDB` escolhe uma para você, que pode ser a primeira Key `UNIQUE` definida em colunas `NOT NULL`, ou uma Key gerada pelo sistema. Para evitar incertezas e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da instrução `CREATE TABLE`.

  O MySQL cria um novo Clustered Index copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de Index desejada. Assim que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome de tabela temporário diferente. A tabela temporária que compreende o novo Clustered Index é renomeada com o nome da tabela original, e a tabela original é removida do Database.

  Os aprimoramentos de desempenho online que se aplicam a operações em Secondary Indexes não se aplicam ao Index da Primary Key. As linhas de uma tabela InnoDB são armazenadas em um Clustered Index organizado com base na Primary Key, formando o que alguns sistemas de Database chamam de "tabela organizada por Index". Como a estrutura da tabela está intimamente ligada à Primary Key, redefinir a Primary Key ainda requer a cópia dos dados.

  Quando uma operação na Primary Key usa `ALGORITHM=INPLACE`, mesmo que os dados ainda sejam copiados, é mais eficiente do que usar `ALGORITHM=COPY` porque:

  + Não é necessário Undo Logging ou Redo Logging associado para `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às instruções DDL que usam `ALGORITHM=COPY`.

  + As entradas do Secondary Index são pré-ordenadas e, portanto, podem ser carregadas em ordem.

  + O Change Buffer não é usado, porque não há inserções de acesso aleatório nos Secondary Indexes.

  Se o servidor sair durante a criação de um novo Clustered Index, nenhum dado é perdido, mas você deve completar o processo de recuperação usando as tabelas temporárias que existem durante o processo. Como é raro recriar um Clustered Index ou redefinir Primary Keys em tabelas grandes, ou encontrar uma falha de sistema durante esta operação, este manual não fornece informações sobre como se recuperar deste cenário.

* Remover uma Primary Key

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

  Somente `ALGORITHM=COPY` suporta a remoção de uma Primary Key sem adicionar uma nova na mesma instrução `ALTER TABLE`.

* Remover uma Primary Key e adicionar outra

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

#### Operações de Coluna

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de coluna. Um asterisco indica informação adicional, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.12 Suporte DDL Online para Operações de Coluna**

<table summary="Suporte DDL online para operações de coluna, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna</th> <td>Sim</td> <td>Sim</td> <td>Sim*</td> <td>Não</td> </tr><tr> <th>Remover uma coluna (Dropping a column)</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Renomear uma coluna</th> <td>Sim</td> <td>Não</td> <td>Sim*</td> <td>Sim</td> </tr><tr> <th>Reordenar colunas</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Definir um valor padrão para coluna</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o tipo de dado da coluna</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Estender o tamanho de coluna <code>VARCHAR</code></th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Remover o valor padrão da coluna</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Alterar o valor de Auto-Increment</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Não*</td> </tr><tr> <th>Tornar uma coluna <code>NULL</code></th> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Tornar uma coluna <code>NOT NULL</code></th> <td>Sim*</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Modificar a definição de uma coluna <code>ENUM</code> ou <code>SET</code></th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Adicionar uma coluna

  ```sql
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  DML concorrente não é permitido ao adicionar uma coluna Auto-Increment. Os dados são reorganizados substancialmente, tornando esta uma operação custosa. No mínimo, é exigido `ALGORITHM=INPLACE, LOCK=SHARED`.

* Remover uma coluna (Dropping a column)

  ```sql
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

* Renomear uma coluna

  ```sql
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Para permitir DML concorrente, mantenha o mesmo tipo de dado e altere apenas o nome da coluna.

  Quando você mantém o mesmo tipo de dado e atributo `[NOT] NULL`, alterando apenas o nome da coluna, a operação pode sempre ser realizada online.

  Você também pode renomear uma coluna que faz parte de uma Foreign Key Constraint. A definição da Foreign Key é automaticamente atualizada para usar o novo nome da coluna. Renomear uma coluna que participa de uma Foreign Key funciona apenas com `ALGORITHM=INPLACE`. Se você usar a cláusula `ALGORITHM=COPY`, ou alguma outra condição fizer com que a operação use `ALGORITHM=COPY`, a instrução `ALTER TABLE` falhará.

  `ALGORITHM=INPLACE` não é suportado para renomear uma Coluna Gerada.

* Reordenar colunas

  Para reordenar colunas, use `FIRST` ou `AFTER` nas operações `CHANGE` ou `MODIFY`.

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

* Alterar o tipo de dado da coluna

  ```sql
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

  A alteração do tipo de dado da coluna é suportada apenas com `ALGORITHM=COPY`.

* Estender o tamanho da coluna `VARCHAR`

  ```sql
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  O número de bytes de comprimento exigidos por uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` de 0 a 255 bytes em tamanho, um byte de comprimento é exigido para codificar o valor. Para colunas `VARCHAR` de 256 bytes em tamanho ou mais, são exigidos dois bytes de comprimento. Como resultado, o `ALTER TABLE` no local (in-place) suporta apenas o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` no local não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento exigidos muda de 1 para 2, o que é suportado apenas por uma cópia de tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de byte único de VARCHAR(255) para VARCHAR(256) usando `ALTER TABLE` no local retorna este erro:

  ```sql
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Note

  O comprimento em bytes de uma coluna `VARCHAR` depende do comprimento em bytes do conjunto de caracteres.

  A diminuição do tamanho `VARCHAR` usando `ALTER TABLE` no local não é suportada. A diminuição do tamanho `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

* Definir um valor padrão para coluna

  ```sql
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifica apenas o metadata da tabela. Os valores padrão de coluna são armazenados no arquivo .frm para a tabela, não no Dicionário de Dados do `InnoDB`.

* Remover o valor padrão da coluna

  ```sql
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Alterar o valor de Auto-Increment

  ```sql
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifica um valor armazenado na memória, não no arquivo de dados.

  Em um sistema distribuído usando Replication ou Sharding, você às vezes redefine o contador Auto-Increment para uma tabela para um valor específico. A próxima linha inserida na tabela usa o valor especificado para sua coluna Auto-Increment. Você também pode usar esta técnica em um ambiente de Data Warehousing onde você esvazia periodicamente todas as tabelas e as recarrega, e reinicia a sequência Auto-Increment a partir de 1.

* Tornar uma coluna `NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local. Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

* Tornar uma coluna `NOT NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local. `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` `SQL_MODE` é exigido para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores NULL. O servidor proíbe alterações em colunas de Foreign Key que tenham o potencial de causar perda de integridade referencial. Consulte Seção 13.1.8, “ALTER TABLE Statement”. Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

* Modificar a definição de uma coluna `ENUM` ou `SET`

  ```sql
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modificar a definição de uma coluna `ENUM` ou `SET` adicionando novos membros de enumeração ou set ao *final* da lista de valores de membros válidos pode ser realizado no local (in place), desde que o tamanho de armazenamento do tipo de dado não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros muda o armazenamento exigido por valor de 1 byte para 2 bytes; isso requer uma cópia de tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia de tabela.

#### Operações de Coluna Gerada

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de coluna gerada. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.13 Suporte DDL Online para Operações de Coluna Gerada**

<table summary="Suporte DDL online para operações de coluna gerada, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Adicionar uma coluna <code>STORED</code></th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Modificar ordem de coluna <code>STORED</code></th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna <code>STORED</code></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Adicionar uma coluna <code>VIRTUAL</code></th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Modificar ordem de coluna <code>VIRTUAL</code></th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Remover uma coluna <code>VIRTUAL</code></th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Adicionar uma coluna `STORED`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  `ADD COLUMN` não é uma operação in-place para colunas stored (feita sem usar uma tabela temporária) porque a expressão deve ser avaliada pelo servidor.

* Modificar ordem de coluna `STORED`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

  Reconstrói a tabela no local.

* Remover uma coluna `STORED`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela no local.

* Adicionar uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Adicionar uma coluna virtual é uma operação in-place para tabelas não particionadas. No entanto, adicionar uma coluna virtual não pode ser combinado com outras ações `ALTER TABLE`.

  Adicionar uma coluna `VIRTUAL` não é uma operação in-place para tabelas particionadas.

* Modificar ordem de coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

* Remover uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Remover uma coluna `VIRTUAL` é uma operação in-place para tabelas não particionadas. No entanto, remover uma coluna virtual não pode ser combinado com outras ações `ALTER TABLE`.

  Remover uma coluna `VIRTUAL` não é uma operação in-place para tabelas particionadas.

#### Operações de Foreign Key

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de Foreign Key. Um asterisco indica informação adicional, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.14 Suporte DDL Online para Operações de Foreign Key**

<table summary="Suporte DDL online para operações de foreign key, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Adicionar uma Foreign Key Constraint</th> <td>Sim*</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Remover uma Foreign Key Constraint</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Adicionar uma Foreign Key Constraint

  O algoritmo `INPLACE` é suportado quando `foreign_key_checks` está desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```sql
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

* Remover uma Foreign Key Constraint

  ```sql
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

  A remoção de uma Foreign Key pode ser realizada online com a opção `foreign_key_checks` ativada ou desativada.

  Se você não souber os nomes das Foreign Key Constraints em uma tabela específica, emita a seguinte instrução e encontre o nome da Constraint na cláusula `CONSTRAINT` para cada Foreign Key:

  ```sql
  SHOW CREATE TABLE table\G
  ```

  Ou, faça uma Query na tabela `TABLE_CONSTRAINTS` do Information Schema e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das Foreign Keys.

  Você também pode remover uma Foreign Key e seu Index associado em uma única instrução:

  ```sql
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Note

Se Foreign Keys já estiverem presentes na tabela que está sendo alterada (ou seja, é uma tabela filha contendo uma cláusula `FOREIGN KEY ... REFERENCE`), restrições adicionais se aplicam às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da Foreign Key:

* Um `ALTER TABLE` na tabela filha pode esperar que outra transaction seja commitada, se uma alteração na tabela pai causar alterações associadas na tabela filha por meio de uma cláusula `ON UPDATE` ou `ON DELETE` usando os parâmetros `CASCADE` ou `SET NULL`.

* Da mesma forma, se uma tabela for a tabela pai em um relacionamento de Foreign Key, mesmo que não contenha cláusulas `FOREIGN KEY`, ela pode esperar que o `ALTER TABLE` seja concluído se uma instrução `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela filha.

#### Operações de Tabela

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de tabela. Um asterisco indica informação adicional, uma exceção ou uma dependência. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.15 Suporte DDL Online para Operações de Tabela**

<table summary="Suporte DDL online para operações de tabela, indicando se a operação é realizada no local, reconstrói a tabela, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Alterar o <code>ROW_FORMAT</code></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Alterar o <code>KEY_BLOCK_SIZE</code></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Configurar estatísticas persistentes da tabela</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Especificar um conjunto de caracteres</th> <td>Sim</td> <td>Sim*</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Converter um conjunto de caracteres</th> <td>Não</td> <td>Sim*</td> <td>Não</td> <td>Não</td> </tr><tr> <th>Otimizar uma tabela</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Reconstruir com a opção <code>FORCE</code></th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Realizar uma reconstrução "nula"</th> <td>Sim*</td> <td>Sim</td> <td>Sim</td> <td>Não</td> </tr><tr> <th>Renomear uma tabela</th> <td>Sim</td> <td>Não</td> <td>Sim</td> <td>Sim</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

* Alterar o `ROW_FORMAT`

  ```sql
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

  Para informações adicionais sobre a opção `ROW_FORMAT`, consulte Opções de Tabela.

* Alterar o `KEY_BLOCK_SIZE`

  ```sql
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Os dados são reorganizados substancialmente, tornando esta uma operação custosa.

  Para informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte Opções de Tabela.

* Configurar opções de estatísticas persistentes da tabela

  ```sql
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifica apenas o metadata da tabela.

  As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para mais informações, consulte Seção 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”.

* Especificar um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Reconstrói a tabela se a nova codificação de caracteres for diferente.

* Converter um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=COPY;
  ```

  Reconstrói a tabela se a nova codificação de caracteres for diferente.

* Otimizar uma tabela

  ```sql
  OPTIMIZE TABLE tbl_name;
  ```

  A operação in-place não é suportada para tabelas com Indexes `FULLTEXT`. A operação usa o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

* Reconstruir uma tabela com a opção `FORCE`

  ```sql
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com Indexes `FULLTEXT`.

* Realizar uma reconstrução "nula"

  ```sql
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com Indexes `FULLTEXT`.

* Renomear uma tabela

  ```sql
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  O MySQL renomeia arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a instrução `RENAME TABLE` para renomear tabelas. Consulte Seção 13.1.33, “RENAME TABLE Statement”.) Privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte DDL online para operações de Tablespace. Para detalhes, consulte Sintaxe e Notas de Uso.

**Tabela 14.16 Suporte DDL Online para Operações de Tablespace**

<table summary="Suporte DDL online para operações de tablespace, indicando se a operação é realizada no local, reconstrói tabelas dentro do tablespace, permite DML concorrente, ou apenas modifica metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operação</th> <th>No Local (In Place)</th> <th>Reconstrói Tabela</th> <th>Permite DML Concorrente</th> <th>Apenas Modifica Metadata</th> </tr></thead><tbody><tr> <th>Ativar ou desativar a Encryption de Tablespace file-per-table</th> <td>Não</td> <td>Sim</td> <td>Não</td> <td>Não</td> </tr></tbody></table>

##### Sintaxe e Notas de Uso

Ativar ou desativar a Encryption de Tablespace file-per-table

```sql
ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
```

A Encryption é suportada apenas para tablespaces file-per-table. Para informações relacionadas, consulte Seção 14.14, “InnoDB Data-at-Rest Encryption”.

#### Operações de Particionamento

Com exceção da maioria das cláusulas de particionamento `ALTER TABLE`, as operações DDL online para tabelas `InnoDB` particionadas seguem as mesmas regras aplicáveis às tabelas `InnoDB` regulares.

A maioria das cláusulas de particionamento `ALTER TABLE` não passa pela mesma API DDL online interna que as tabelas `InnoDB` regulares não particionadas. Como resultado, o suporte online para cláusulas de particionamento `ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada instrução de particionamento `ALTER TABLE`. Independentemente da API DDL online utilizada, o MySQL tenta minimizar a cópia de dados e o Locking sempre que possível.

Opções de particionamento `ALTER TABLE` que usam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, reparticionam a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela instrução `ALTER TABLE`, e os dados da tabela são copiados para a nova estrutura da tabela.

**Tabela 14.17 Suporte DDL Online para Operações de Particionamento**

<table summary="Suporte DDL online para operações de particionamento, indicando se a operação é realizada no local e permite DML concorrente."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th>Cláusula de Particionamento</th> <th>No Local (In Place)</th> <th>Permite DML</th> <th>Notas</th> </tr></thead><tbody><tr> <th><code>PARTITION BY</code></th> <td>Não</td> <td>Não</td> <td>Permite <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr><tr> <th><code>ADD PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Não copia dados existentes para tabelas particionadas por <code>RANGE</code> ou <code>LIST</code>. Queries concorrentes são permitidas para tabelas particionadas por <code>HASH</code> ou <code>LIST</code>. O MySQL copia os dados enquanto mantém um Shared Lock.</td> </tr><tr> <th><code>DROP PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Não copia dados existentes para tabelas particionadas por <code>RANGE</code> ou <code>LIST</code>.</td> </tr><tr> <th><code>DISCARD PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><code>IMPORT PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><code>TRUNCATE PARTITION</code></th> <td>Sim</td> <td>Sim</td> <td>Não copia dados existentes. Simplesmente deleta linhas; não altera a definição da tabela em si, nem de nenhuma de suas partitions.</td> </tr><tr> <th><code>COALESCE PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Queries concorrentes são permitidas para tabelas particionadas por <code>HASH</code> ou <code>LIST</code>, pois o MySQL copia os dados enquanto mantém um Shared Lock.</td> </tr><tr> <th><code>REORGANIZE PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Queries concorrentes são permitidas para tabelas particionadas por <code>LINEAR HASH</code> ou <code>LIST</code>. O MySQL copia dados das partitions afetadas enquanto mantém um Lock de metadata compartilhado.</td> </tr><tr> <th><code>EXCHANGE PARTITION</code></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th><code>ANALYZE PARTITION</code></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th><code>CHECK PARTITION</code></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th><code>OPTIMIZE PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Cláusulas <code>ALGORITHM</code> e <code>LOCK</code> são ignoradas. Reconstrói a tabela inteira. Consulte Seção 22.3.4, “Maintenance of Partitions”.</td> </tr><tr> <th><code>REBUILD PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Permite apenas <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Queries concorrentes são permitidas para tabelas particionadas por <code>LINEAR HASH</code> ou <code>LIST</code>. O MySQL copia dados das partitions afetadas enquanto mantém um Lock de metadata compartilhado.</td> </tr><tr> <th><code>REPAIR PARTITION</code></th> <td>Sim</td> <td>Sim</td> <td></td> </tr><tr> <th><code>REMOVE PARTITIONING</code></th> <td>Não</td> <td>Não</td> <td>Permite <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr></tbody></table>

Operações `ALTER TABLE` não relacionadas a particionamento em tabelas particionadas seguem as mesmas regras aplicáveis às tabelas regulares. No entanto, `ALTER TABLE` executa operações online em cada Partition da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplas partitions.

Para informações adicionais sobre cláusulas de particionamento `ALTER TABLE`, consulte Opções de Particionamento e Seção 13.1.8.1, “ALTER TABLE Partition Operations”. Para informações sobre particionamento em geral, consulte Capítulo 22, *Partitioning*.