### 13.2.5 Declaração INSERT

[13.2.5.1 Declaração INSERT ... SELECT](insert-select.html)

[13.2.5.2 Declaração INSERT ... ON DUPLICATE KEY UPDATE](insert-on-duplicate.html)

[13.2.5.3 Declaração INSERT DELAYED](insert-delayed.html)

```sql
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {VALUES | VALUE} (value_list) [, (value_list)] ...
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

A declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") insere novas linhas em uma tabela existente. As formas [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") e [`INSERT ... SET`](insert.html "13.2.5 INSERT Statement") da declaração inserem linhas com base em valores explicitamente especificados. A forma [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") insere linhas selecionadas de outra(s) tabela(s). A declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") com uma cláusula `ON DUPLICATE KEY UPDATE` permite que linhas existentes sejam atualizadas caso uma linha a ser inserida cause um valor duplicado em um `UNIQUE` index ou `PRIMARY KEY`.

Para informações adicionais sobre [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") e [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), consulte [Seção 13.2.5.1, “Declaração INSERT ... SELECT”](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") e [Seção 13.2.5.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

No MySQL 5.7, a palavra-chave `DELAYED` é aceita, mas ignorada pelo server. Para saber os motivos disso, consulte [Seção 13.2.5.3, “Declaração INSERT DELAYED”](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement").

Inserir em uma tabela requer o privilégio [`INSERT`](privileges-provided.html#priv_insert) para a tabela. Se a cláusula `ON DUPLICATE KEY UPDATE` for usada e uma chave duplicada fizer com que um [`UPDATE`](update.html "13.2.11 UPDATE Statement") seja realizado, a declaração requer o privilégio [`UPDATE`](privileges-provided.html#priv_update) para as colunas a serem atualizadas. Para colunas que são lidas, mas não modificadas, você precisa apenas do privilégio [`SELECT`](privileges-provided.html#priv_select) (como para uma coluna referenciada apenas no lado direito de uma atribuição *`col_name`*=*`expr`* em uma cláusula `ON DUPLICATE KEY UPDATE`).

Ao inserir em uma partitioned table, você pode controlar quais partitions e subpartitions aceitam novas linhas. A cláusula `PARTITION` aceita uma lista de nomes separados por vírgula de uma ou mais partitions ou subpartitions (ou ambas) da tabela. Se alguma das linhas a serem inseridas por uma dada declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") não corresponder a uma das partitions listadas, a declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") falha com o erro *Found a row not matching the given partition set*. Para mais informações e exemplos, consulte [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

*`tbl_name`* é a tabela na qual as linhas devem ser inseridas. Especifique as colunas para as quais a declaração fornece valores da seguinte forma:

* Forneça uma lista entre parênteses de nomes de colunas separados por vírgula após o nome da tabela. Neste caso, um valor para cada coluna nomeada deve ser fornecido pela lista `VALUES` ou pela declaração [`SELECT`](select.html "13.2.9 SELECT Statement").

* Se você não especificar uma lista de nomes de colunas para [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") ou [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), os valores para todas as colunas da tabela devem ser fornecidos pela lista `VALUES` ou pela declaração [`SELECT`](select.html "13.2.9 SELECT Statement"). Se você não souber a ordem das colunas na tabela, use `DESCRIBE tbl_name` para descobrir.

* Uma cláusula `SET` indica explicitamente as colunas pelo nome, juntamente com o valor a ser atribuído a cada uma.

Os valores das colunas podem ser fornecidos de várias maneiras:

* Se o strict SQL mode não estiver habilitado, qualquer coluna para a qual não foi explicitamente fornecido um valor é definida com seu valor `DEFAULT` (explícito ou implícito). Por exemplo, se você especificar uma lista de colunas que não nomeia todas as colunas na tabela, as colunas sem nome são definidas com seus valores `DEFAULT`. A atribuição de valores `DEFAULT` é descrita na [Seção 11.6, “Valores DEFAULT de Tipos de Dados”](data-type-defaults.html "11.6 Data Type Default Values"). Consulte também [Seção 1.6.3.3, “Restrições em Dados Inválidos”](constraint-invalid-data.html "1.6.3.3 Constraints on Invalid Data").

  Se o strict SQL mode estiver habilitado, uma declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") gera um erro se não especificar um valor explícito para cada coluna que não tenha um valor `DEFAULT`. Consulte [Seção 5.1.10, “Modos SQL do Servidor”](sql-mode.html "5.1.10 Server SQL Modes").

* Se tanto a lista de colunas quanto a lista `VALUES` estiverem vazias, [`INSERT`](insert.html "13.2.5 INSERT Statement") cria uma linha com cada coluna definida para seu valor `DEFAULT`:

  ```sql
  INSERT INTO tbl_name () VALUES();
  ```

  Se o strict mode não estiver habilitado, o MySQL usa o valor `DEFAULT` implícito para qualquer coluna que não tenha um `DEFAULT` explicitamente definido. Se o strict mode estiver habilitado, ocorre um erro se alguma coluna não tiver um valor `DEFAULT`.

* Use a palavra-chave `DEFAULT` para definir explicitamente uma coluna para seu valor `DEFAULT`. Isso torna mais fácil escrever declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") que atribuem valores a todas as colunas, exceto algumas, pois permite evitar a escrita de uma lista `VALUES` incompleta que não inclua um valor para cada coluna na tabela. Caso contrário, você deve fornecer a lista de nomes de colunas correspondentes a cada valor na lista `VALUES`.

* Se uma generated column for inserida explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre generated columns, consulte [Seção 13.1.18.7, “CREATE TABLE e Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

* Em expressões, você pode usar [`DEFAULT(col_name)`](miscellaneous-functions.html#function_default) para produzir o valor `DEFAULT` para a coluna *`col_name`*.

* A conversão de tipo de uma expressão *`expr`* que fornece um valor de coluna pode ocorrer se o tipo de dado da expressão não corresponder ao tipo de dado da coluna. A conversão de um determinado valor pode resultar em valores inseridos diferentes, dependendo do tipo de coluna. Por exemplo, inserir a string `'1999.0e-2'` em uma coluna [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), [`DECIMAL(10,6)`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), ou [`YEAR`](year.html "11.2.4 The YEAR Type") insere o valor `1999`, `19.9921`, `19.992100`, ou `1999`, respectivamente. O valor armazenado nas colunas [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e [`YEAR`](year.html "11.2.4 The YEAR Type") é `1999` porque a conversão de string para número considera apenas a parte inicial da string que pode ser considerada um integer ou year válido. Para as colunas [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") e [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), a conversão de string para número considera a string inteira como um valor numeric válido.

* Uma expressão *`expr`* pode se referir a qualquer coluna que tenha sido definida anteriormente em uma lista de valores. Por exemplo, você pode fazer isso porque o valor para `col2` se refere a `col1`, que foi previamente atribuída:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

  Mas o seguinte não é legal, porque o valor para `col1` se refere a `col2`, que é atribuída depois de `col1`:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

  Uma exceção ocorre para colunas que contêm valores `AUTO_INCREMENT`. Como os valores `AUTO_INCREMENT` são gerados após outras atribuições de valor, qualquer referência a uma coluna `AUTO_INCREMENT` na atribuição retorna `0`.

As declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") que usam a sintaxe `VALUES` podem inserir múltiplas linhas. Para fazer isso, inclua múltiplas listas de valores de coluna separados por vírgula, com as listas entre parênteses e separadas por vírgulas. Exemplo:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3),(4,5,6),(7,8,9);
```

Cada lista de valores deve conter exatamente o mesmo número de valores a serem inseridos por linha. A seguinte declaração é inválida porque contém uma lista de nove valores, em vez de três listas de três valores cada:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` é um sinônimo de `VALUES` neste contexto. Nenhum dos termos implica algo sobre o número de listas de valores, nem sobre o número de valores por lista. Qualquer um pode ser usado, quer haja uma única lista de valores ou múltiplas listas, e independentemente do número de valores por lista.

O valor de affected-rows para uma declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") pode ser obtido usando a função SQL [`ROW_COUNT()`](information-functions.html#function_row-count) ou a função C API [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html). Consulte [Seção 12.15, “Funções de Informação”](information-functions.html "12.15 Information Functions") e [mysql_affected_rows()](/doc/c-api/5.7/en/mysql-affected-rows.html).

Se você usar uma declaração [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") com múltiplas listas de valores ou [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), a declaração retorna uma string de informação neste formato:

```sql
Records: N1 Duplicates: N2 Warnings: N3
```

Se você estiver usando a C API, a string de informação pode ser obtida invocando a função [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html). Consulte [mysql_info()](/doc/c-api/5.7/en/mysql-info.html).

`Records` indica o número de linhas processadas pela declaração. (Este não é necessariamente o número de linhas realmente inseridas, pois `Duplicates` pode ser diferente de zero.) `Duplicates` indica o número de linhas que não puderam ser inseridas porque duplicariam algum valor existente de unique index. `Warnings` indica o número de tentativas de inserir valores de coluna que foram problemáticos de alguma forma. Warnings podem ocorrer sob qualquer uma das seguintes condições:

* Inserir `NULL` em uma coluna que foi declarada `NOT NULL`. Para declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") de múltiplas linhas ou declarações [`INSERT INTO ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), a coluna é definida para o valor `DEFAULT` implícito para o tipo de dado da coluna. Este é `0` para numeric types, a string vazia (`''`) para string types e o valor "zero" para date and time types. As declarações [`INSERT INTO ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") são tratadas da mesma forma que inserts de múltiplas linhas, porque o server não examina o result set do [`SELECT`](select.html "13.2.9 SELECT Statement") para ver se ele retorna uma única linha. (Para um [`INSERT`](insert.html "13.2.5 INSERT Statement") de linha única, nenhum warning ocorre quando `NULL` é inserido em uma coluna `NOT NULL`. Em vez disso, a declaração falha com um erro.)

* Definir uma numeric column com um valor que está fora do range da coluna. O valor é ajustado (clipped) para o ponto final mais próximo do range.

* Atribuir um valor como `'10.34 a'` a uma numeric column. O texto não numérico subsequente é removido e a parte numérica restante é inserida. Se o valor da string não tiver uma parte numérica inicial, a coluna é definida como `0`.

* Inserir uma string em uma string column ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")) que exceda o comprimento máximo da coluna. O valor é truncado para o comprimento máximo da coluna.

* Inserir um valor em uma coluna de date ou time que é ilegal para o tipo de dado. A coluna é definida para o valor zero apropriado para o tipo.

* Para exemplos de [`INSERT`](insert.html "13.2.5 INSERT Statement") envolvendo valores de coluna `AUTO_INCREMENT`, consulte [Seção 3.6.9, “Usando AUTO_INCREMENT”](example-auto-increment.html "3.6.9 Using AUTO_INCREMENT").

  Se [`INSERT`](insert.html "13.2.5 INSERT Statement") insere uma linha em uma tabela que possui uma coluna `AUTO_INCREMENT`, você pode encontrar o valor usado para essa coluna usando a função SQL [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) ou a função C API [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html).

  Note

  Essas duas funções nem sempre se comportam de forma idêntica. O comportamento das declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") em relação às colunas `AUTO_INCREMENT` é discutido em mais detalhes na [Seção 12.15, “Funções de Informação”](information-functions.html "12.15 Information Functions") e em [mysql_insert_id()](/doc/c-api/5.7/en/mysql-insert-id.html).

A declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") suporta os seguintes modifiers:

* Se você usar o modifier `LOW_PRIORITY`, a execução do [`INSERT`](insert.html "13.2.5 INSERT Statement") é atrasada até que nenhum outro client esteja lendo a tabela. Isso inclui outros clients que começaram a ler enquanto clients existentes estão lendo, e enquanto a declaração `INSERT LOW_PRIORITY` está esperando. É possível, portanto, que um client que emita uma declaração `INSERT LOW_PRIORITY` espere por um tempo muito longo.

  `LOW_PRIORITY` afeta apenas storage engines que usam apenas table-level locking (como `MyISAM`, `MEMORY` e `MERGE`).

  Note

  `LOW_PRIORITY` normalmente não deve ser usado com tabelas `MyISAM` porque isso desabilita concurrent inserts. Consulte [Seção 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

* Se você especificar `HIGH_PRIORITY`, ele anula o efeito da opção [`--low-priority-updates`](server-system-variables.html#sysvar_low_priority_updates) caso o server tenha sido iniciado com essa opção. Isso também faz com que concurrent inserts não sejam usados. Consulte [Seção 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

  `HIGH_PRIORITY` afeta apenas storage engines que usam apenas table-level locking (como `MyISAM`, `MEMORY` e `MERGE`).

* Se você usar o modifier `IGNORE`, erros ignoráveis que ocorrem durante a execução da declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") são ignorados. Por exemplo, sem `IGNORE`, uma linha que duplica um valor existente de `UNIQUE` index ou `PRIMARY KEY` na tabela causa um erro de chave duplicada e a declaração é abortada. Com `IGNORE`, a linha é descartada e nenhum erro ocorre. Erros ignorados geram warnings.

  `IGNORE` tem um efeito semelhante em inserts em partitioned tables onde nenhuma partition correspondente a um determinado valor é encontrada. Sem `IGNORE`, tais declarações [`INSERT`](insert.html "13.2.5 INSERT Statement") são abortadas com um erro. Quando [`INSERT IGNORE`](insert.html "13.2.5 INSERT Statement") é usado, a operação de insert falha silenciosamente para linhas contendo o valor não correspondente, mas insere as linhas que são correspondidas. Para um exemplo, consulte [Seção 22.2.2, “LIST Partitioning”](partitioning-list.html "22.2.2 LIST Partitioning").

  Conversões de dados que disparariam erros abortam a declaração se `IGNORE` não for especificado. Com `IGNORE`, valores inválidos são ajustados para os valores mais próximos e inseridos; warnings são produzidos, mas a declaração não é abortada. Você pode determinar com a função C API [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html) quantas linhas foram realmente inseridas na tabela.

  Para mais informações, consulte [O Efeito de IGNORE na Execução da Declaração](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

  Você pode usar [`REPLACE`](replace.html "13.2.8 REPLACE Statement") em vez de [`INSERT`](insert.html "13.2.5 INSERT Statement") para sobrescrever linhas antigas. [`REPLACE`](replace.html "13.2.8 REPLACE Statement") é a contraparte de [`INSERT IGNORE`](insert.html "13.2.5 INSERT Statement") no tratamento de novas linhas que contêm valores de unique key que duplicam linhas antigas: As novas linhas substituem as antigas em vez de serem descartadas. Consulte [Seção 13.2.8, “Declaração REPLACE”](replace.html "13.2.8 REPLACE Statement").

* Se você especificar `ON DUPLICATE KEY UPDATE`, e uma linha for inserida que causaria um valor duplicado em um `UNIQUE` index ou `PRIMARY KEY`, um [`UPDATE`](update.html "13.2.11 UPDATE Statement") da linha antiga ocorre. O valor de affected-rows por linha é 1 se a linha for inserida como nova, 2 se uma linha existente for atualizada, e 0 se uma linha existente for definida para seus valores atuais. Se você especificar a flag `CLIENT_FOUND_ROWS` para a função C API [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) ao se conectar ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), o valor de affected-rows será 1 (não 0) se uma linha existente for definida para seus valores atuais. Consulte [Seção 13.2.5.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

* [`INSERT DELAYED`](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement") foi descontinuado no MySQL 5.6 e está programado para eventual remoção. No MySQL 5.7, o modifier `DELAYED` é aceito, mas ignorado. Use `INSERT` (sem `DELAYED`) em seu lugar. Consulte [Seção 13.2.5.3, “Declaração INSERT DELAYED”](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement").

Uma declaração `INSERT` que afeta uma partitioned table usando um storage engine como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") que emprega table-level locks bloqueia apenas as partitions nas quais as linhas são realmente inseridas. (Para storage engines como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") que empregam row-level locking, nenhum locking de partitions ocorre.) Para mais informações, consulte [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
