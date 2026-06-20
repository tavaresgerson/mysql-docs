## 14.13 InnoDB e DDL Online

O recurso DDL online oferece suporte para alterações de tabela no local e DML concorrente. Os benefícios desse recurso incluem:

* Melhor resposta e disponibilidade em ambientes de produção ocupados, onde deixar uma tabela indisponível por minutos ou horas não é prático.

* A capacidade de ajustar o equilíbrio entre desempenho e concorrência durante operações de DDL usando a cláusula `LOCK`. Veja a cláusula LOCK.

* Menos espaço em disco e sobrecarga de I/O do que o método de cópia de tabela.

Normalmente, você não precisa fazer nada de especial para habilitar o DDL online. Por padrão, o MySQL executa a operação no local, conforme permitido, com o menor bloqueio possível.

Você pode controlar aspectos de uma operação de DDL usando as cláusulas `ALGORITHM` e `LOCK` da declaração `ALTER TABLE`. Essas cláusulas são colocadas no final da declaração, separadas das especificações de tabela e coluna por vírgulas. Por exemplo:

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
```

A cláusula `LOCK` é útil para ajustar o grau de acesso concorrente à tabela. A cláusula `ALGORITHM` é destinada principalmente para comparações de desempenho e como uma solução de fallback para o comportamento mais antigo de cópia de tabela, caso você encontre algum problema. Por exemplo:

* Para evitar que a tabela seja indisponível para leituras, escritas ou ambas, especifique uma cláusula na declaração `ALTER TABLE`, como `LOCK=NONE` (permite leituras e escritas) ou `LOCK=SHARED` (permite leituras). A operação pára imediatamente se o nível de concorrência solicitado não estiver disponível.

* Para comparar o desempenho entre os algoritmos, execute uma declaração com `ALGORITHM=INPLACE` e `ALGORITHM=COPY`. Alternativamente, execute uma declaração com a opção de configuração `old_alter_table` desativada e ativada.

* Para evitar sobrecarregar o servidor com uma operação `ALTER TABLE` que copia a tabela, inclua `ALGORITHM=INPLACE`. A declaração pára imediatamente se não puder usar o mecanismo de inserção em lugar.

### 14.13.1 Operações de DDL Online

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

**Tabela 14.10 Suporte de DDL online para operações de índice**

<table summary="Online DDL support for index operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Creating or adding a secondary index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping an index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Renaming an index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Adding a <code>FULLTEXT</code> index</th> <td>Yes*</td> <td>No*</td> <td>No</td> <td>No</td> </tr><tr> <th>Adding a <code>SPATIAL</code> index</th> <td>Yes</td> <td>No</td> <td>No</td> <td>No</td> </tr><tr> <th>Changing the index type</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Criar ou adicionar um índice secundário

  ```sql
  CREATE INDEX name ON table (col_list);
  ```

  ```sql
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo criado. A declaração `CREATE INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

O suporte online para DDL (Data Definition Language) para adicionar índices secundários significa que, geralmente, você pode acelerar o processo geral de criação e carregamento de uma tabela e índices associados, criando a tabela sem índices secundários e, em seguida, adicionando índices secundários após o carregamento dos dados.

Um índice secundário recém-criado contém apenas os dados comprometidos na tabela no momento em que a declaração `CREATE INDEX` ou `ALTER TABLE` termina a execução. Ele não contém quaisquer valores não comprometidos, versões antigas de valores ou valores marcados para exclusão, mas ainda não removidos do índice antigo.

Se o servidor sair durante a criação de um índice secundário, na recuperação, o MySQL elimina quaisquer índices parcialmente criados. Você deve executar novamente a declaração `ALTER TABLE` ou `CREATE INDEX`.

Alguns fatores afetam o desempenho, o uso do espaço e a semântica dessa operação. Para obter detalhes, consulte a Seção 14.13.6, “Limitações do DDL online”.

* A queda de um índice

  ```sql
  DROP INDEX name ON table;
  ```

  ```sql
  ALTER TABLE tbl_name DROP INDEX name;
  ```

A tabela permanece disponível para operações de leitura e escrita enquanto o índice está sendo descartado. A declaração `DROP INDEX` só termina após todas as transações que estão acessando a tabela serem concluídas, para que o estado inicial do índice reflita os conteúdos mais recentes da tabela.

* Renomear um índice

  ```sql
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adicionando um índice `FULLTEXT`

  ```sql
  CREATE FULLTEXT INDEX name ON table(column);
  ```

A adição do primeiro índice `FULLTEXT` reconstrui a tabela se não houver uma coluna definida pelo usuário `FTS_DOC_ID`. Índices adicionais `FULLTEXT` podem ser adicionados sem a necessidade de reconstruir a tabela.

* Adicionando um índice `SPATIAL`

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Alterar o tipo de índice (`USING {BTREE | HASH}`)

  ```sql
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INPLACE;
  ```

#### Operações de Chave Primária

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave primária. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Consulte as Notas de sintaxe e uso.

**Tabela 14.11 Suporte de DDL online para operações de chave primária**

<table summary="Online DDL support for primary key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a primary key</th> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping a primary key</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a primary key and adding another</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionar uma chave primária

  ```sql
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara. `ALGORITHM=INPLACE` não é permitido sob certas condições, se as colunas tiverem que ser convertidas para `NOT NULL`.

A reestruturação do índice agrupado sempre requer a cópia dos dados da tabela. Portanto, é melhor definir a chave primária quando você cria uma tabela, em vez de emitir `ALTER TABLE ... ADD PRIMARY KEY` mais tarde.

Quando você cria um índice `UNIQUE` ou `PRIMARY KEY`, o MySQL deve realizar algum trabalho adicional. Para índices `UNIQUE`, o MySQL verifica se a tabela não contém valores duplicados para a chave. Para um índice `PRIMARY KEY`, o MySQL também verifica que nenhuma das colunas `PRIMARY KEY` contenha um `NULL`.

Quando você adiciona uma chave primária usando a cláusula `ALGORITHM=COPY`, o MySQL converte os valores `NULL` nas colunas associadas em valores padrão: 0 para números, uma string vazia para colunas baseadas em caracteres e BLOBs, e 0000-00-00 00:00:00 para `DATETIME`. Esse é um comportamento não padrão que a Oracle recomenda que você não confie. Adicionar uma chave primária usando `ALGORITHM=INPLACE` é permitido apenas quando a configuração `SQL_MODE` inclui as bandeiras `strict_trans_tables` ou `strict_all_tables`; quando a configuração `SQL_MODE` é estrita, `ALGORITHM=INPLACE` é permitido, mas a declaração ainda pode falhar se as colunas da chave primária solicitadas contiverem valores `NULL`. O comportamento `ALGORITHM=INPLACE` é mais compatível com o padrão.

Se você criar uma tabela sem uma chave primária, `InnoDB` escolhe uma para você, que pode ser a primeira chave `UNIQUE` definida nas colunas de `NOT NULL`, ou uma chave gerada pelo sistema. Para evitar a incerteza e o potencial requisito de espaço para uma coluna oculta extra, especifique a cláusula `PRIMARY KEY` como parte da declaração `CREATE TABLE`.

O MySQL cria um novo índice agrupado copiando os dados existentes da tabela original para uma tabela temporária que possui a estrutura de índice desejada. Uma vez que os dados são completamente copiados para a tabela temporária, a tabela original é renomeada com um nome diferente para a tabela temporária. A tabela temporária que compreende o novo índice agrupado é renomeada com o nome da tabela original, e a tabela original é eliminada do banco de dados.

As melhorias de desempenho online que se aplicam às operações em índices secundários não se aplicam ao índice da chave primária. As strings de uma tabela InnoDB são armazenadas em um índice agrupado organizado com base na chave primária, formando o que alguns sistemas de banco de dados chamam de "tabela organizada por índice". Como a estrutura da tabela está intimamente ligada à chave primária, redefinir a chave primária ainda requer a cópia dos dados.

Quando uma operação na chave primária usa `ALGORITHM=INPLACE`, mesmo que os dados ainda sejam copiados, é mais eficiente do que usar `ALGORITHM=COPY`, porque:

+ Não é necessário registro de desfazer ou registro de correção associado para `ALGORITHM=INPLACE`. Essas operações adicionam sobrecarga às declarações DDL que utilizam `ALGORITHM=COPY`.

+ As entradas do índice secundário estão pré-ordenadas e, portanto, podem ser carregadas em ordem.

+ O buffer de alteração não é usado, porque não há inserções de acesso aleatório nos índices secundários.

Se o servidor sair durante a criação de um novo índice agrupado, os dados não serão perdidos, mas você deve completar o processo de recuperação usando as tabelas temporárias que existem durante o processo. Como é raro recriar um índice agrupado ou redefinir chaves primárias em tabelas grandes, ou encontrar um travamento do sistema durante essa operação, este manual não fornece informações sobre como recuperar desse cenário.

* Deixar uma chave primária

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

Apenas `ALGORITHM=COPY` permite a eliminação de uma chave primária sem a adição de uma nova na mesma declaração `ALTER TABLE`.

* Remover uma chave primária e adicionar outra

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

#### Operações de Coluna

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.12 Suporte de DDL online para operações de coluna**

<table summary="Online DDL support for column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a column</th> <td>Yes</td> <td>Yes</td> <td>Yes*</td> <td>No</td> </tr><tr> <th>Dropping a column</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Renaming a column</th> <td>Yes</td> <td>No</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th>Reordering columns</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting a column default value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the column data type</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Extending <code>VARCHAR</code> column size</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping the column default value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the auto-increment value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No*</td> </tr><tr> <th>Making a column <code>NULL</code></th> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Making a column <code>NOT NULL</code></th> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Modifying the definition of an <code>ENUM</code> or <code>SET</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma coluna

  ```sql
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INPLACE, LOCK=NONE;
  ```

A DML concorrente não é permitida ao adicionar uma coluna de autoincremento. Os dados são reorganizados substancialmente, tornando-se uma operação cara. No mínimo, é necessário `ALGORITHM=INPLACE, LOCK=SHARED`.

* Deixar uma coluna

  ```sql
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

* Renomear uma coluna

  ```sql
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Para permitir DML concorrente, mantenha o mesmo tipo de dados e altere apenas o nome da coluna.

Quando você mantém o mesmo tipo de dados e o atributo `[NOT] NULL`, apenas alterando o nome da coluna, a operação sempre pode ser realizada online.

Você também pode renomear uma coluna que faz parte de uma restrição de chave estrangeira. A definição da chave estrangeira é automaticamente atualizada para usar o novo nome da coluna. Renomear uma coluna que participa de uma chave estrangeira só funciona com `ALGORITHM=INPLACE`. Se você usar a cláusula `ALGORITHM=COPY`, ou alguma outra condição faz com que a operação use `ALGORITHM=COPY`, a declaração `ALTER TABLE` falha.

`ALGORITHM=INPLACE` não é suportado para renomear uma coluna gerada.

* Reordenar colunas

Para reordenar as colunas, use `FIRST` ou `AFTER` nas operações de `CHANGE` ou `MODIFY`.

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

* Alterar o tipo de dados da coluna

  ```sql
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

A alteração do tipo de dados da coluna só é suportada com `ALGORITHM=COPY`.

* Ampliar o tamanho da coluna `VARCHAR`

  ```sql
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

O número de bytes de comprimento necessários para uma coluna `VARCHAR` deve permanecer o mesmo. Para colunas `VARCHAR` com tamanho de 0 a 255 bytes, é necessário um byte de comprimento para codificar o valor. Para colunas `VARCHAR` com tamanho de 256 bytes ou mais, são necessários dois bytes de comprimento. Como resultado, o `ALTER TABLE` in-place só suporta o aumento do tamanho da coluna `VARCHAR` de 0 a 255 bytes, ou de 256 bytes para um tamanho maior. O `ALTER TABLE` in-place não suporta o aumento do tamanho de uma coluna `VARCHAR` de menos de 256 bytes para um tamanho igual ou maior que 256 bytes. Neste caso, o número de bytes de comprimento necessários muda de 1 para 2, o que é suportado apenas por uma cópia da tabela (`ALGORITHM=COPY`). Por exemplo, tentar alterar o tamanho da coluna `VARCHAR` para um conjunto de caracteres de um único byte de VARCHAR(255) para VARCHAR(256) usando `ALTER TABLE` in-place retorna este erro:

  ```sql
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

Nota

O comprimento de byte de uma coluna `VARCHAR` depende do comprimento de byte do conjunto de caracteres.

A redução do tamanho de `VARCHAR` usando `ALTER TABLE` em local é não suportada. A redução do tamanho de `VARCHAR` requer uma cópia da tabela (`ALGORITHM=COPY`).

* Definir um valor padrão para uma coluna

  ```sql
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Apenas modifica os metadados da tabela. Os valores padrão das colunas são armazenados no arquivo .frm da tabela, não no dicionário de dados `InnoDB`.

* Deixar um valor padrão de coluna em branco

  ```sql
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Alterar o valor de autoincremento

  ```sql
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Modifica um valor armazenado na memória, não o arquivo de dados.

Em um sistema distribuído que utiliza replicação ou fragmentação, às vezes você redefre o contador de autoincremento de uma tabela para um valor específico. A próxima string inserida na tabela usa o valor especificado para sua coluna de autoincremento. Você também pode usar essa técnica em um ambiente de data warehousing, onde você periodicamente esvazia todas as tabelas e as carrega novamente, e reinicia a sequência de autoincremento a partir do número 1.

* Fazendo uma coluna `NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local. Os dados são reorganizados substancialmente, tornando-a uma operação cara.

* Fazendo uma coluna `NOT NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Reconstrói a tabela no local. `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` `SQL_MODE` é necessário para que a operação seja bem-sucedida. A operação falha se a coluna contiver valores NULL. O servidor proíbe alterações em colunas de chave estrangeira que possam causar perda de integridade referencial. Veja a Seção 13.1.8, “Declaração ALTER TABLE”. Os dados são reorganizados substancialmente, tornando-os uma operação cara.

* Modificando a definição de uma coluna `ENUM` ou `SET`

  ```sql
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INPLACE, LOCK=NONE;
  ```

A modificação da definição de uma coluna `ENUM` ou `SET` adicionando novos membros de enumeração ou conjunto ao *final* da lista de valores de membro válidos pode ser realizada in loco, desde que o tamanho de armazenamento do tipo de dados não mude. Por exemplo, adicionar um membro a uma coluna `SET` que tem 8 membros altera o armazenamento necessário por valor de 1 byte para 2 bytes; isso requer uma cópia da tabela. Adicionar membros no meio da lista causa a renumeração dos membros existentes, o que requer uma cópia da tabela.

#### Operações de Coluna Gerada

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de coluna geradas. Para detalhes, consulte a Sintaxe e Notas de Uso.

**Tabela 14.13 Suporte de DDL online para operações de coluna gerada**

<table summary="Online DDL support for generated column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a <code>STORED</code> column</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Modifying <code>STORED</code> column order</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>STORED</code> column</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Adding a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Modifying <code>VIRTUAL</code> column order</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma coluna `STORED`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

`ADD COLUMN` não é uma operação in-place para colunas armazenadas (realizada sem o uso de uma tabela temporária), porque a expressão deve ser avaliada pelo servidor.

* Modificando a ordem da coluna `STORED`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

Refaz a tabela no local.

* Deixar uma coluna `STORED`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Refaz a tabela no local.

* Adicionando uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INPLACE, LOCK=NONE;
  ```

Adicionar uma coluna virtual é uma operação in-place para tabelas não particionadas. No entanto, a adição de uma coluna virtual não pode ser combinada com outras ações do `ALTER TABLE`.

Adicionar um `VIRTUAL` não é uma operação de substituição para tabelas particionadas.

* Modificando a ordem da coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

* Deixar uma coluna `VIRTUAL`

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

A eliminação de uma coluna `VIRTUAL` é uma operação de substituição para tabelas não particionadas. No entanto, a eliminação de uma coluna virtual não pode ser combinada com outras ações `ALTER TABLE`.

A eliminação de um `VIRTUAL` não é uma operação de substituição para tabelas particionadas.

#### Operações de Chave Estrangeira

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de chave estrangeira. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.14 Suporte de DDL online para operações de chave estrangeira**

<table summary="Online DDL support for foreign key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a foreign key constraint</th> <td>Yes*</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping a foreign key constraint</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Adicionando uma restrição de chave estrangeira

O algoritmo `INPLACE` é suportado quando o `foreign_key_checks` é desativado. Caso contrário, apenas o algoritmo `COPY` é suportado.

  ```sql
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

* Remover uma restrição de chave estrangeira

  ```sql
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

A eliminação de uma chave estrangeira pode ser realizada online com a opção `foreign_key_checks` habilitada ou desabilitada.

Se você não conhece os nomes dos constrangimentos de chave estrangeira em uma tabela específica, emita a seguinte declaração e encontre o nome do constrangimento na cláusula `CONSTRAINT` para cada chave estrangeira:

  ```sql
  SHOW CREATE TABLE table\G
  ```

Ou, consulte a tabela do esquema de informações `TABLE_CONSTRAINTS` e use as colunas `CONSTRAINT_NAME` e `CONSTRAINT_TYPE` para identificar os nomes das chaves estrangeiras.

Você também pode excluir uma chave estrangeira e seu índice associado em uma única declaração:

  ```sql
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Nota

Se as chaves estrangeiras já estiverem presentes na tabela que está sendo alterada (ou seja, se for uma tabela secundária que contém uma cláusula `FOREIGN KEY ... REFERENCE`, aplicam-se restrições adicionais às operações DDL online, mesmo aquelas que não envolvem diretamente as colunas da chave estrangeira:

* Uma `ALTER TABLE` na tabela de crianças pode esperar que outra transação seja confirmada, se uma alteração na tabela de pais causar alterações associadas na tabela de crianças por meio de uma cláusula `ON UPDATE` ou `ON DELETE`, usando os parâmetros `CASCADE` ou `SET NULL`.

* Da mesma forma, se uma tabela for a tabela principal em uma relação de chave estrangeira, mesmo que ela não contenha quaisquer cláusulas `FOREIGN KEY`, ela pode esperar que o `ALTER TABLE` seja concluído se uma declaração `INSERT`, `UPDATE` ou `DELETE` causar uma ação `ON UPDATE` ou `ON DELETE` na tabela secundária.

#### Operações de tabela

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tabela. Um asterisco indica informações adicionais, uma exceção ou uma dependência. Para detalhes, consulte as Notas de sintaxe e uso.

**Tabela 14.15 Suporte de DDL online para operações de tabela**

<table summary="Online DDL support for table operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Changing the <code>ROW_FORMAT</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Changing the <code>KEY_BLOCK_SIZE</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting persistent table statistics</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Specifying a character set</th> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Converting a character set</th> <td>No</td> <td>Yes*</td> <td>No</td> <td>No</td> </tr><tr> <th>Optimizing a table</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Rebuilding with the <code>FORCE</code> option</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Performing a null rebuild</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Renaming a table</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

* Alterar o `ROW_FORMAT`

  ```sql
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

Para informações adicionais sobre a opção `ROW_FORMAT`, consulte as Opções de tabela.

* Alterar o `KEY_BLOCK_SIZE`

  ```sql
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Os dados são reorganizados de forma substancial, o que torna uma operação cara.

Para informações adicionais sobre a opção `KEY_BLOCK_SIZE`, consulte as Opções de tabela.

* Definindo opções de estatísticas persistentes de tabela

  ```sql
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Apenas modifica o metadados da tabela.

As estatísticas persistentes incluem `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando parâmetros de estatísticas persistentes do otimizador”.

* Especificar um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Reconstrói a tabela se o novo código de caracteres for diferente.

* Converter um conjunto de caracteres

  ```sql
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=COPY;
  ```

Reconstrói a tabela se o novo código de caracteres for diferente.

* Otimizar uma tabela

  ```sql
  OPTIMIZE TABLE tbl_name;
  ```

A operação in-place não é suportada para tabelas com índices `FULLTEXT`. A operação utiliza o algoritmo `INPLACE`, mas a sintaxe `ALGORITHM` e `LOCK` não é permitida.

* Reconstrução de uma tabela com a opção `FORCE`

  ```sql
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Realizar uma reconstrução "nulo"

  ```sql
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

Usa `ALGORITHM=INPLACE` a partir do MySQL 5.6.17. `ALGORITHM=INPLACE` não é suportado para tabelas com índices `FULLTEXT`.

* Renomear uma tabela

  ```sql
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

O MySQL renomeia os arquivos que correspondem à tabela *`tbl_name`* sem fazer uma cópia. (Você também pode usar a declaração `RENAME TABLE` para renomear tabelas. Veja Seção 13.1.33, “Declaração RENAME TABLE”.) Os privilégios concedidos especificamente para a tabela renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

#### Operações de Tablespace

A tabela a seguir fornece uma visão geral do suporte de DDL online para operações de tablespace. Para detalhes, consulte a Sintaxe e Notas de Uso.

**Tabela 14.16 Suporte de DDL online para operações de Tablespace**

<table summary="Online DDL support for tablespace operations indicating whether the operation is performed in place, rebuilds tables within the tablespace, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Enabling or disabling file-per-table tablespace encryption</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr></tbody></table>

##### Notas sobre sintaxe e uso

Habilitar ou desabilitar a criptografia do espaço de tabela por tabela

```sql
ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
```

A criptografia é apenas suportada para espaços de tabela por arquivo. Para informações relacionadas, consulte a Seção 14.14, “Criptografia de dados em repouso do InnoDB”.

#### Operações de Partição

Com exceção da maioria das cláusulas de particionamento `ALTER TABLE`, as operações online de DDL para tabelas particionadas `InnoDB` seguem as mesmas regras que se aplicam às tabelas regulares `InnoDB`.

A maioria das cláusulas de particionamento `ALTER TABLE` não passa pela mesma API interna de DDL online como as tabelas regulares não particionadas `InnoDB`. Como resultado, o suporte online para cláusulas de particionamento `ALTER TABLE` varia.

A tabela a seguir mostra o status online para cada declaração de particionamento `ALTER TABLE`. Independentemente da API de DDL online que é usada, o MySQL tenta minimizar a cópia e o bloqueio de dados quando possível.

`ALTER TABLE` opções de particionamento que utilizam `ALGORITHM=COPY` ou que permitem apenas “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, repare a tabela usando o algoritmo `COPY`. Em outras palavras, uma nova tabela particionada é criada com o novo esquema de particionamento. A tabela recém-criada inclui quaisquer alterações aplicadas pela declaração `ALTER TABLE`, e os dados da tabela são copiados na nova estrutura de tabela.

**Tabela 14.17 Suporte de DDL online para operações de particionamento**

<table summary="Online DDL support for partitioning operatings indicating whether the operation is performed in place and permits concurrent DML."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th>Partitioning Clause</th> <th>In Place</th> <th>Permits DML</th> <th>Notes</th> </tr></thead><tbody><tr> <th><code>PARTITION BY</code></th> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr><tr> <th><code>ADD PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Apenas permissões<code>ALGORITHM=DEFAULT</code>,<code>LOCK=DEFAULT</code>. Não copia dados existentes para tabelas particionadas por<code>RANGE</code>ou<code>LIST</code>. Consultas concorrentes são permitidas para tabelas particionadas por<code>HASH</code>ou<code>LIST</code>. O MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th><code>DROP PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Apenas permissões<code>ALGORITHM=DEFAULT</code>,<code>LOCK=DEFAULT</code>. Não copia dados existentes para tabelas particionadas por<code>RANGE</code>ou<code>LIST</code>.</td> </tr><tr> <th><code>DISCARD PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><code>IMPORT PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>TRUNCATE PARTITION</code></a></th> <td>Sim</td> <td>Sim</td> <td>Não copia dados existentes. Ele apenas exclui as strings; não altera a definição da própria tabela ou de qualquer uma de suas partições.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>COALESCE PARTITION</code></a></th> <td>Não</td> <td>Não</td> <td>Apenas permissões<code>ALGORITHM=DEFAULT</code>,<code>LOCK=DEFAULT</code>. Consultas concorrentes são permitidas para tabelas particionadas por<code>HASH</code>ou<code>LIST</code>, pois o MySQL copia os dados enquanto mantém um bloqueio compartilhado.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>REORGANIZE PARTITION</code></a></th> <td>Não</td> <td>Não</td> <td>Apenas permissões<code>ALGORITHM=DEFAULT</code>,<code>LOCK=DEFAULT</code>. Consultas concorrentes são permitidas para tabelas particionadas por<code>LINEAR HASH</code>ou<code>LIST</code>. O MySQL copia os dados das partições afetadas enquanto mantém uma bloqueio de metadados compartilhado.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>EXCHANGE PARTITION</code></a></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><code>ANALYZE PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><code>CHECK PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>OPTIMIZE PARTITION</code></a></th> <td>Não</td> <td>Não</td> <td><code>ALGORITHM</code>e<code>LOCK</code>As cláusulas são ignoradas. Reconstrói toda a tabela. Veja a Seção 22.3.4, “Manutenção de Partições”.</td> </tr><tr> <th><code>REBUILD PARTITION</code></th> <td>Não</td> <td>Não</td> <td>Apenas permissões<code>ALGORITHM=DEFAULT</code>,<code>LOCK=DEFAULT</code>. Consultas concorrentes são permitidas para tabelas particionadas por<code>LINEAR HASH</code>ou<code>LIST</code>. O MySQL copia os dados das partições afetadas enquanto mantém uma bloqueio de metadados compartilhado.</td> </tr><tr> <th><code>REPAIR PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>REMOVE PARTITIONING</code></a></th> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr></tbody></table>

As operações online sem particionamento em tabelas particionadas `ALTER TABLE` seguem as mesmas regras que se aplicam às tabelas regulares. No entanto, `ALTER TABLE` realiza operações online em cada particionamento da tabela, o que causa um aumento na demanda por recursos do sistema devido às operações sendo realizadas em múltiplos particionamentos.

Para informações adicionais sobre as cláusulas de particionamento de `ALTER TABLE`, consulte Opções de particionamento e Seção 13.1.8.1, “Operações de Partição de Tabela”. Para informações sobre particionamento em geral, consulte o Capítulo 22, *Particionamento*.

### 14.13.2 Desempenho e Concorrência de DDL Online

O DDL online melhora vários aspectos do funcionamento do MySQL:

* As aplicações que acessam a tabela são mais responsivas, pois as consultas e operações de manipulação de dados (DML) na tabela podem prosseguir enquanto a operação de definição de dados (DDL) está em andamento. A redução do bloqueio e a espera por recursos do servidor MySQL levam a uma maior escalabilidade, mesmo para operações que não estão envolvidas na operação de DDL.

* As operações in-place evitam os ciclos de E/S de disco e de CPU associados ao método de cópia de tabela, o que minimiza a carga geral no banco de dados. Minimizar a carga ajuda a manter um bom desempenho e alto desempenho durante a operação de DDL.

As operações de leitura em local reduzem a quantidade de dados lidos no pool de buffer em relação às operações de cópia de tabela, o que reduz a purga de dados frequentemente acessados da memória. A purga de dados frequentemente acessados pode causar uma queda temporária no desempenho após uma operação de DDL.

#### A cláusula LOCK

Por padrão, o MySQL usa o mínimo de bloqueio possível durante uma operação de DDL. A cláusula `LOCK` pode ser especificada para impor um bloqueio mais restritivo, se necessário. Se a cláusula `LOCK` especificar um nível de bloqueio menos restritivo do que o permitido para uma operação específica de DDL, a declaração falha com um erro. As cláusulas `LOCK` são descritas abaixo, na ordem de menos restritiva para a mais restritiva:

* `LOCK=NONE`:

Permite consultas concorrentes e DML.

Por exemplo, use esta cláusula para tabelas que envolvem inscrições ou compras de clientes, para evitar que as tabelas fiquem indisponíveis durante operações prolongadas de DDL.

* `LOCK=SHARED`:

Permite consultas concorrentes, mas bloqueia DML.

Por exemplo, use esta cláusula em tabelas de data warehouse, onde você pode adiar operações de carregamento de dados até que a operação de DDL esteja concluída, mas as consultas não podem ser adiadas por longos períodos.

* `LOCK=DEFAULT`:

Permita a mesma concorrência possível (consultas concorrentes, DML ou ambas). O omitindo a cláusula `LOCK` é o mesmo que especificar `LOCK=DEFAULT`.

Use esta cláusula quando você sabe que o nível de bloqueio padrão da declaração DDL não causa problemas de disponibilidade para a tabela.

* `LOCK=EXCLUSIVE`:

Bloqueia consultas concorrentes e DML.

Use esta cláusula se a principal preocupação for terminar a operação DDL no menor tempo possível, e o acesso a consultas e DML concorrentes não for necessário. Você também pode usar esta cláusula se o servidor estiver supostamente parado, para evitar acessos inesperados à tabela.

#### Fechamentos de DDL e Metadados Online

As operações de DDL online podem ser vistas como tendo três fases:

* *Fase 1: Inicialização*

Na fase de inicialização, o servidor determina o nível de concorrência permitido durante a operação, levando em conta as capacidades do mecanismo de armazenamento, as operações especificadas na declaração e as opções `ALGORITHM` e `LOCK` especificadas pelo usuário. Durante esta fase, uma chave de metadados compartilhada e atualizável é tomada para proteger a definição atual da tabela.

* *Fase 2: Execução*

Nesta fase, a declaração é preparada e executada. Se a restrição de metadados é atualizada para exclusiva, isso depende dos fatores avaliados na fase de inicialização. Se uma restrição de metadados exclusiva for necessária, ela é apenas tomada brevemente durante a preparação da declaração.

* *Fase 3: Definição da Tabela de Compromissos*

Na fase de definição da tabela de compromisso, o bloqueio de metadados é atualizado para exclusivo para expulsar a definição antiga da tabela e comprometê-la com a nova. Uma vez concedido, a duração do bloqueio exclusivo de metadados é breve.

Devido aos requisitos exclusivos de bloqueio de metadados descritos acima, uma operação online de DDL pode ter que esperar por transações concorrentes que mantêm blocos de metadados na tabela para ser concluída ou revogada. As transações iniciadas antes ou durante a operação de DDL podem manter blocos de metadados na tabela que está sendo alterada. No caso de uma transação em andamento ou inativa, uma operação online de DDL pode expirar enquanto espera por um bloqueio de metadados exclusivo. Além disso, um bloqueio de metadados exclusivo pendente solicitado por uma operação online de DDL bloqueia transações subsequentes na tabela.

O exemplo a seguir demonstra uma operação DDL online aguardando uma bloqueio exclusivo de metadados e como um bloqueio de metadados pendente bloqueia transações subsequentes na tabela.

Sessão 1:

```sql
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

A declaração `SELECT` da sessão 1 obtém uma garantia de metadados compartilhada na tabela t1.

Sessão 2:

```sql
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

A operação DDL online na sessão 2, que requer um bloqueio exclusivo de metadados na tabela t1 para confirmar as alterações na definição da tabela, deve esperar que a transação da sessão 1 seja confirmada ou revertida.

Sessão 3:

```sql
mysql> SELECT * FROM t1;
```

A declaração `SELECT` emitida na sessão 3 está bloqueada, aguardando que o bloqueio exclusivo de metadados solicitado pela operação `ALTER TABLE` na sessão 2 seja concedido.

Você pode usar `SHOW FULL PROCESSLIST` para determinar se as transações estão aguardando uma trava de metadados.

```sql
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

As informações de bloqueio de metadados também são exibidas na tabela do Schema de desempenho `metadata_locks`, que fornece informações sobre as dependências de bloqueio de metadados entre as sessões, o bloqueio de metadados que uma sessão está esperando e a sessão que atualmente detém o bloqueio de metadados. Para mais informações, consulte a Seção 25.12.12.1, “A tabela metadata_locks”.

#### Desempenho do DDL online

O desempenho de uma operação DDL é em grande parte determinado pelo fato de a operação ser realizada no local e se ela reconstrui a tabela.

Para avaliar o desempenho relativo de uma operação de DDL, você pode comparar os resultados usando `ALGORITHM=INPLACE` com os resultados usando `ALGORITHM=COPY`. Alternativamente, você pode comparar os resultados com `old_alter_table` desativado e ativado.

Para operações de DDL que modificam dados de tabela, você pode determinar se uma operação de DDL realiza alterações no local ou realiza uma cópia da tabela, observando o valor "strings afetadas" exibido após o término do comando. Por exemplo:

* Alterar o valor padrão de uma coluna (rápido, não afeta os dados da tabela):

  ```sql
  Query OK, 0 rows affected (0.07 sec)
  ```

* Adicionar um índice (leva tempo, mas `0 rows affected` mostra que a tabela não está copiada):

  ```sql
  Query OK, 0 rows affected (21.42 sec)
  ```

* Alterar o tipo de dados de uma coluna (leva tempo substancial e exige a reconstrução de todas as strings da tabela):

  ```sql
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Antes de executar uma operação DDL em uma tabela grande, verifique se a operação é rápida ou lenta da seguinte forma:

1. Faça uma cópia da estrutura da tabela.
2. Encha a tabela copiada com uma pequena quantidade de dados.
3. Execute a operação DDL na tabela copiada.
4. Verifique se o valor "rows affected" é zero ou não. Um valor diferente de zero significa que a operação copia os dados da tabela, o que pode exigir um planejamento especial. Por exemplo, você pode realizar a operação DDL durante um período de indisponibilidade programada ou em cada servidor replicado, um de cada vez.

Nota

Para uma compreensão mais aprofundada do processamento do MySQL associado a uma operação de DDL, examine o Gerador de desempenho e as tabelas `INFORMATION_SCHEMA` relacionadas a `InnoDB` antes e depois das operações de DDL para ver o número de leituras físicas, escritas, alocações de memória, etc.

Os eventos de estágio do esquema de desempenho podem ser usados para monitorar o progresso do `ALTER TABLE`. Veja a Seção 14.17.1, “Monitoramento do progresso da ALTER TABLE para tabelas InnoDB usando o esquema de desempenho”.

Como há algum trabalho de processamento envolvido na gravação das alterações feitas por operações DML concorrentes, e depois na aplicação dessas alterações no final, uma operação online de DDL pode levar mais tempo no geral do que o mecanismo de cópia de tabela que bloqueia o acesso à tabela de outras sessões. A redução no desempenho bruto é compensada pela melhor capacidade de resposta para aplicativos que usam a tabela. Ao avaliar as técnicas para alterar a estrutura da tabela, considere a percepção do usuário final do desempenho, com base em fatores como os tempos de carregamento das páginas da web.

### 14.13.3 Requisitos de Espaço para DDL Online

As operações online de DDL têm os seguintes requisitos de espaço:

* Arquivos de registro temporários:

Um arquivo de registro temporário registra DML concorrente quando uma operação online de DDL cria um índice ou altera uma tabela. O arquivo de registro temporário é estendido conforme necessário pelo valor de `innodb_sort_buffer_size` até um máximo especificado por `innodb_online_alter_log_max_size`. Se a operação levar um longo tempo e a DML concorrente modificar a tabela tanto que o tamanho do arquivo de registro temporário exceda o valor de `innodb_online_alter_log_max_size`, a operação online de DDL falha com um erro `DB_ONLINE_LOG_TOO_BIG` e as operações DML concorrentes não comprometidas são revertidas. Um grande ajuste de `innodb_online_alter_log_max_size` permite mais DML durante uma operação online de DDL, mas também estende o período de tempo no final da operação de DDL quando a tabela é bloqueada para aplicar DML registrada.

A variável `innodb_sort_buffer_size` também define o tamanho do buffer de leitura e do buffer de escrita do arquivo de registro temporário.

* Arquivos temporários:

As operações DDL online que reconstroem a tabela escrevem arquivos temporários de ordenação no diretório temporário do MySQL (`$TMPDIR` em Unix, `%TEMP%` em Windows ou o diretório especificado por `--tmpdir`) durante a criação do índice. Arquivos temporários de ordenação não são criados no diretório que contém a tabela original. Cada arquivo temporário de ordenação é grande o suficiente para conter uma coluna de dados, e cada arquivo de ordenação é removido quando seus dados são agregados à tabela ou índice final. As operações que envolvem arquivos temporários de ordenação podem exigir espaço temporário igual à quantidade de dados na tabela mais os índices. Um erro é relatado se a operação DDL online usa todo o espaço disponível no sistema de arquivos onde o diretório de dados reside.

Se o diretório temporário do MySQL não for grande o suficiente para conter os arquivos de classificação, defina `tmpdir` para um diretório diferente. Alternativamente, defina um diretório temporário separado para operações DDL online usando `innodb_tmpdir`. Esta opção foi introduzida no MySQL 5.7.11 para ajudar a evitar a sobrecarga do diretório temporário que poderia ocorrer como resultado de grandes arquivos de classificação temporários.

* Arquivos de tabela intermediários:

Algumas operações de DDL online que reconstroem a tabela criam um arquivo de tabela intermediária temporária no mesmo diretório da tabela original. Um arquivo de tabela intermediária pode exigir espaço igual ao tamanho da tabela original. Os nomes dos arquivos de tabela intermediária começam com o prefixo `#sql-ib` e aparecem apenas brevemente durante a operação de DDL online.

A opção `innodb_tmpdir` não é aplicável a arquivos de tabela intermediários.

### 14.13.4 Simplificando declarações DDL com DDL online

Antes da introdução do DDL online, era prática comum combinar muitas operações de DDL em uma única declaração `ALTER TABLE`. Como cada declaração `ALTER TABLE` envolvia a cópia e reconstrução da tabela, era mais eficiente fazer várias alterações na mesma tabela de uma vez, uma vez que essas alterações poderiam ser feitas todas com uma única operação de reconstrução para a tabela. O inconveniente era que o código SQL envolvendo operações de DDL era mais difícil de manter e reutilizar em diferentes scripts. Se as alterações específicas fossem diferentes a cada vez, você poderia ter que construir um novo complexo `ALTER TABLE` para cada cenário ligeiramente diferente.

Para operações DDL que podem ser realizadas in loco, você pode separá-las em declarações individuais `ALTER TABLE` para facilitar o script e a manutenção, sem sacrificar a eficiência. Por exemplo, você pode tomar uma declaração complicada, como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

e que o decomponha em partes mais simples que possam ser testadas e realizadas de forma independente, como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

Você ainda pode usar declarações multi-partes `ALTER TABLE` para:

* Operações que devem ser realizadas em uma sequência específica, como criar um índice seguido de uma restrição de chave estrangeira que utilize esse índice.

* As operações utilizam todas a mesma cláusula específica `LOCK`, que você quer que seja bem-sucedida ou falha como um grupo.

* Operações que não podem ser realizadas no local, ou seja, que ainda utilizam o método de cópia de tabela.

* Operações para as quais você especificar `ALGORITHM=COPY` ou `old_alter_table=1`, para forçar o comportamento de cópia de tabela, se necessário, para compatibilidade precisa em cenários especializados.

### 14.13.5 Condições de falha no DDL online

O fracasso de uma operação de DDL online geralmente ocorre devido a uma das seguintes condições:

* Uma cláusula `ALGORITHM` especifica um algoritmo que não é compatível com o tipo específico de operação de DDL ou motor de armazenamento.

* Uma cláusula `LOCK` especifica um baixo grau de bloqueio (`SHARED` ou `NONE`) que não é compatível com o tipo específico de operação DDL.

* Um tempo de espera ocorre enquanto espera por um bloqueio exclusivo na tabela, que pode ser necessário brevemente durante as fases inicial e final da operação de DDL.

* O sistema de arquivos `tmpdir` ou `innodb_tmpdir` fica sem espaço em disco, enquanto o MySQL escreve arquivos temporários de classificação no disco durante a criação do índice. Para mais informações, consulte a Seção 14.13.3, “Requisitos de espaço DDL online”.

* A operação leva muito tempo e a DML concorrente modifica a tabela tanto que o tamanho do log online temporário excede o valor da opção de configuração `innodb_online_alter_log_max_size`. Esta condição causa um erro `DB_ONLINE_LOG_TOO_BIG`.

* O DML concorrente faz alterações na tabela que são permitidas com a definição original da tabela, mas não com a nova. A operação só falha no final, quando o MySQL tenta aplicar todas as alterações das declarações de DML concorrente. Por exemplo, você pode inserir valores duplicados em uma coluna enquanto um índice único está sendo criado, ou pode inserir valores `NULL` em uma coluna enquanto está sendo criado um índice de chave primária nessa coluna. As alterações feitas pelo DML concorrente têm precedência, e a operação `ALTER TABLE` é efetivamente revertida.

### 14.13.6 Limitações de DDL Online

As seguintes limitações se aplicam às operações DDL online:

* A tabela é copiada ao criar um índice em um `TEMPORARY TABLE`.

* A cláusula `ALTER TABLE` `LOCK=NONE` não é permitida se houver restrições `ON...CASCADE` ou `ON...SET NULL` na tabela.

* Antes que uma operação de DDL online possa terminar, ela deve esperar por transações que possuam bloqueios de metadados na tabela para serem confirmadas ou revertidas. Uma operação de DDL online pode exigir brevemente um bloqueio exclusivo de metadados na tabela durante sua fase de execução e sempre requer um na fase final da operação ao atualizar a definição da tabela. Consequentemente, transações que possuem bloqueios de metadados na tabela podem fazer com que uma operação de DDL online seja bloqueada. As transações que possuem bloqueios de metadados na tabela podem ter sido iniciadas antes ou durante a operação de DDL online. Uma transação longa ou inativa que possui um bloqueio de metadados na tabela pode fazer com que uma operação de DDL online seja temporariamente suspensa.

* Uma operação DDL online em uma tabela em uma relação de chave estrangeira não espera que uma transação seja executada na outra tabela na relação de chave estrangeira para ser confirmada ou revertida. A transação mantém um bloqueio de metadados exclusivo na tabela que está sendo atualizada e um bloqueio de metadados compartilhado na tabela relacionada à chave estrangeira (requerido para verificação de chave estrangeira). O bloqueio de metadados compartilhado permite que a operação DDL online prossiga, mas bloqueia a operação em sua fase final, quando um bloqueio de metadados exclusivo é necessário para atualizar a definição da tabela. Esse cenário pode resultar em deadlocks, pois outras transações esperam que a operação DDL online seja concluída.

* Ao executar uma operação online de DDL, o thread que executa a declaração `ALTER TABLE` aplica um registro online de operações DML que foram executadas simultaneamente na mesma tabela de outros threads de conexão. Quando as operações DML são aplicadas, é possível encontrar um erro de entrada de chave duplicada (ERROR 1062 (23000): Entrada duplicada), mesmo que a entrada duplicada seja apenas temporária e seja revertida por uma entrada posterior no registro online. Isso é semelhante à ideia de uma verificação de restrição de chave estrangeira em `InnoDB`, na qual as restrições devem ser mantidas durante uma transação.

* `OPTIMIZE TABLE` para uma tabela `InnoDB` é mapeado para uma operação `ALTER TABLE` para reconstruir a tabela e atualizar estatísticas de índice e liberar espaço não utilizado no índice agrupado. Índices secundários não são criados de forma eficiente, pois as chaves são inseridas na ordem em que apareceram na chave primária. `OPTIMIZE TABLE` é suportado com a adição de suporte DDL online para reconstruir tabelas regulares e particionadas `InnoDB`.

* As tabelas criadas antes do MySQL 5.6 que incluem colunas temporais (`DATE`, `DATETIME` ou `TIMESTAMP`) e que não foram reconstruídas usando  `ALGORITHM=COPY` não suportam `ALGORITHM=INPLACE`. Neste caso, uma operação `ALTER TABLE ... ALGORITHM=INPLACE` retorna o seguinte erro:

  ```sql
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

* As seguintes limitações geralmente se aplicam a operações de DDL online em tabelas grandes que envolvem a reconstrução da tabela:

+ Não há mecanismo para pausar uma operação de DDL online ou para limitar o uso de I/O ou CPU para uma operação de DDL online.

O recuo de uma operação de DDL online pode ser caro caso a operação falhe.

+ Operações de DDL online de longa duração podem causar atraso na replicação. Uma operação de DDL online deve terminar de ser executada na fonte antes de ser executada na replica. Além disso, as DML que foram processadas simultaneamente na fonte são processadas apenas na replica após a operação de DDL na replica ser concluída.

Para informações adicionais relacionadas à execução de operações DDL online em tabelas grandes, consulte a Seção 14.13.2, “Desempenho e Concorrência DDL Online”.