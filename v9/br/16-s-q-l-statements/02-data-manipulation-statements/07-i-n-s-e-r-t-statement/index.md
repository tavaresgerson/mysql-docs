### 15.2.7 Instrução `INSERT`

15.2.7.1 Instrução `INSERT ... SELECT`

15.2.7.2 Instrução `INSERT ... ON DUPLICATE KEY UPDATE`

15.2.7.3 Instrução `INSERT DELAYED`

```
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { {VALUES | VALUE} (value_list) [, (value_list)] ... }
    [AS row_alias[(col_alias [, col_alias] ...)]]
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list
    [AS row_alias[(col_alias [, col_alias] ...)]]
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    { SELECT ...
      | TABLE table_name
      | VALUES row_constructor_list
    }
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name =
          value
        | [row_alias.]col_name
        | [tbl_name.]col_name
        | [row_alias.]col_alias

assignment_list:
    assignment [, assignment] ...
```

A instrução `INSERT` insere novas linhas em uma tabela existente. As formas `INSERT ... VALUES`, `INSERT ... VALUES ROW()` e `INSERT ... SET` da instrução inserem linhas com base em valores especificados explicitamente. A forma `INSERT ... SELECT` insere linhas selecionadas de outra(s) tabela(s). Você também pode usar `INSERT ... TABLE` para inserir linhas de uma única tabela. A instrução `INSERT` com uma cláusula `ON DUPLICATE KEY UPDATE` permite que as linhas existentes sejam atualizadas se uma linha a ser inserida causasse um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`. Um alias de linha com um ou mais aliases de coluna opcionais pode ser usado com `ON DUPLICATE KEY UPDATE` para referenciar a linha a ser inserida.

Para obter informações adicionais sobre as instruções `INSERT ... SELECT` e `INSERT ... ON DUPLICATE KEY UPDATE`, consulte a Seção 15.2.7.1, “Instrução `INSERT ... SELECT`”, e a Seção 15.2.7.2, “Instrução `INSERT ... ON DUPLICATE KEY UPDATE`”.

No MySQL 9.5, a palavra-chave `DELAYED` é aceita, mas ignorada pelo servidor. As razões para isso estão na Seção 15.2.7.3, “Instrução `INSERT DELAYED`”.

Inserir em uma tabela requer o privilégio `INSERT` para a tabela. Se a cláusula `ON DUPLICATE KEY UPDATE` for usada e uma chave duplicada causar uma atualização em vez disso, a instrução requer o privilégio `UPDATE` para as colunas a serem atualizadas. Para colunas que são lidas, mas não modificadas, você precisa apenas do privilégio `SELECT` (como para uma coluna referenciada apenas no lado direito de uma atribuição `col_name`*=*`expr`* em uma cláusula `ON DUPLICATE KEY UPDATE`).

Ao inserir em uma tabela particionada, você pode controlar quais particionações e subparticionações aceitam novas linhas. A cláusula `PARTITION` recebe uma lista de nomes separados por vírgula de uma ou mais particionações ou subparticionações (ou ambas) da tabela. Se alguma das linhas a serem inseridas por uma declaração `INSERT` específica não corresponder a uma das particionações listadas, a declaração `INSERT` falha com o erro "Encontrou uma linha que não corresponde ao conjunto de particionações fornecido". Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Particionações”.

* `tbl_name`* é a tabela na qual as linhas devem ser inseridas. Especifique as colunas para as quais a declaração fornece valores da seguinte forma:

* Forneça uma lista entre parênteses de nomes de colunas separados por vírgula após o nome da tabela. Neste caso, um valor para cada coluna nomeada deve ser fornecido pela lista `VALUES`, `VALUES ROW()` ou declaração `SELECT`. Para o formulário `INSERT TABLE`, o número de colunas na tabela de origem deve corresponder ao número de colunas a serem inseridas.

* Se você não especificar uma lista de nomes de colunas para `INSERT ... VALUES` ou `INSERT ... SELECT`, os valores de todas as colunas na tabela devem ser fornecidos pela lista `VALUES`, declaração `SELECT` ou declaração `TABLE`. Se você não sabe a ordem das colunas na tabela, use `DESCRIBE tbl_name` para descobrir.

* A cláusula `SET` indica colunas explicitamente pelo nome, juntamente com o valor a ser atribuído a cada uma.

Os valores das colunas podem ser fornecidos de várias maneiras:

* Se o modo SQL rigoroso não estiver habilitado, qualquer coluna que não seja explicitamente atribuída um valor é definida pelo seu valor padrão (explícito ou implícito). Por exemplo, se você especificar uma lista de colunas que não nomeia todas as colunas da tabela, as colunas não nomeadas são definidas pelos seus valores padrão. A atribuição de valor padrão é descrita na Seção 13.6, “Valores padrão de tipo de dados”.

Se o modo SQL rigoroso estiver ativado, uma instrução `INSERT` gera um erro se não especificar um valor explícito para cada coluna que não tenha um valor padrão. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

* Se a lista de colunas e a lista `VALUES` estiverem vazias, o `INSERT` cria uma linha com cada coluna definida para seu valor padrão:

  ```
  INSERT INTO tbl_name () VALUES();
  ```

  Se o modo rigoroso não estiver ativado, o MySQL usa o valor padrão implícito para qualquer coluna que não tenha um valor definido explicitamente. Se o modo rigoroso estiver ativado, ocorre um erro se qualquer coluna não tiver um valor padrão.

* Use a palavra-chave `DEFAULT` para definir uma coluna explicitamente para seu valor padrão. Isso facilita a escrita de instruções `INSERT` que atribuem valores a todas as colunas, exceto algumas, porque permite evitar a escrita de uma lista `VALUES` incompleta que não inclui um valor para cada coluna da tabela. Caso contrário, você deve fornecer a lista de nomes de colunas correspondentes a cada valor na lista `VALUES`.

* Se uma coluna gerada for inserida explicitamente, o único valor permitido é `DEFAULT`. Para informações sobre colunas geradas, consulte a Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”.

* Em expressões, você pode usar `DEFAULT(col_name)` para produzir o valor padrão para a coluna *`col_name`*.

* A conversão de tipo de uma expressão *`expr`* que fornece um valor de coluna pode ocorrer se o tipo de dados da expressão não corresponder ao tipo de dados da coluna. A conversão de um valor dado pode resultar em diferentes valores inseridos dependendo do tipo da coluna. Por exemplo, inserir a string `'1999.0e-2'` em uma coluna `INT` (INTEIRO), `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`), `FLOAT` (FLUTADO), `DOUBLE`), `DECIMAL(10,6)` (DECIMAL), `NUMERIC`), ou `YEAR` insere o valor `1999`, `19.9921`, `19.992100` ou `1999`, respectivamente. O valor armazenado nas colunas `INT` (INTEIRO), `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT") e `YEAR` é `1999` porque a conversão de string para número só considera a parte inicial da string que pode ser considerada um inteiro ou ano válido. Para as colunas `FLOAT` (FLUTADO), `DOUBLE") e `DECIMAL` (DECIMAL, `NUMERIC")`, a conversão de string para número considera toda a string como um valor numérico válido.

* Uma expressão *`expr`* pode referir-se a qualquer coluna que foi definida anteriormente em uma lista de valores. Por exemplo, você pode fazer isso porque o valor para `col2` refere-se a `col1`, que foi previamente atribuído:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

  Mas o seguinte não é legal, porque o valor para `col1` refere-se a `col2`, que é atribuído após `col1`:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

  Uma exceção ocorre para colunas que contêm valores `AUTO_INCREMENT`. Como os valores `AUTO_INCREMENT` são gerados após outras atribuições de valor, qualquer referência a uma coluna `AUTO_INCREMENT` na atribuição retorna um `0`.

As instruções `INSERT` que usam a sintaxe `VALUES` podem inserir várias linhas. Para fazer isso, inclua várias listas de valores de coluna separados por vírgulas, com listas entre parênteses e separadas por vírgulas. Exemplo:

```
INSERT INTO tbl_name (a,b,c)
    VALUES(1,2,3), (4,5,6), (7,8,9);
```

Cada lista de valores deve conter exatamente tantos valores quanto devem ser inseridos por linha. A seguinte declaração é inválida porque contém uma lista de nove valores, em vez de três listas de três valores cada:

```
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` é um sinônimo de `VALUES` neste contexto. Nenhum implica nada sobre o número de listas de valores, nem sobre o número de valores por lista. Pode ser usado tanto se houver uma única lista de valores quanto se houver múltiplas listas, e independentemente do número de valores por lista.

As instruções `INSERT` usando a sintaxe `VALUES ROW()` também podem inserir múltiplas linhas. Neste caso, cada lista de valores deve estar contida dentro de um `ROW()` (construtor de linha), assim:

```
INSERT INTO tbl_name (a,b,c)
    VALUES ROW(1,2,3), ROW(4,5,6), ROW(7,8,9);
```

O valor `affected-rows` para uma `INSERT` pode ser obtido usando a função `ROW_COUNT()` do SQL ou a função `mysql_affected_rows()` da API C. Veja a Seção 14.15, “Funções de Informação”, e mysql_affected_rows().

Se você usar `INSERT ... VALUES` ou `INSERT ... VALUES ROW()` com múltiplas listas de valores, ou `INSERT ... SELECT` ou `INSERT ... TABLE`, a instrução retorna uma string de informações neste formato:

```
Records: N1 Duplicates: N2 Warnings: N3
```

Se você estiver usando a API C, a string de informações pode ser obtida invocando a função `mysql_info()`. Veja mysql_info().

`Records` indica o número de linhas processadas pela instrução. (Isso não é necessariamente o número de linhas realmente inseridas porque `Duplicates` pode ser diferente de zero.) `Duplicates` indica o número de linhas que não puderam ser inseridas porque duplicariam algum valor de índice único existente. `Warnings` indica o número de tentativas de inserir valores de coluna que foram problemáticos de alguma forma. As avisos podem ocorrer sob qualquer uma das seguintes condições:

* Inserir `NULL` em uma coluna que foi declarada como `NOT NULL`. Para instruções de `INSERT` de múltiplas linhas ou instruções `INSERT INTO ... SELECT`, a coluna é definida pelo valor padrão implícito para o tipo de dados da coluna. Isso é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor "zero" para tipos de data e hora. As instruções `INSERT INTO ... SELECT` são tratadas da mesma forma que as inserções de múltiplas linhas, porque o servidor não examina o conjunto de resultados da consulta `SELECT` para ver se ele retorna uma única linha. (Para uma inserção de uma única linha, não há aviso quando `NULL` é inserido em uma coluna `NOT NULL`. Em vez disso, a instrução falha com um erro.)

* Definir uma coluna numérica para um valor que está fora do intervalo da coluna. O valor é recortado para o ponto final mais próximo do intervalo.

* Atribuir um valor como `'10.34 a'` a uma coluna numérica. O texto não numérico final é removido e a parte numérica restante é inserida. Se o valor da string não tiver uma parte numérica inicial, a coluna é definida como `0`.

* Inserir uma string em uma coluna de string (`CHAR`, `VARCHAR`, `TEXT` ou `BLOB`) que excede o comprimento máximo da coluna. O valor é truncado para o comprimento máximo da coluna.

* Inserir um valor em uma coluna de data ou hora que é ilegal para o tipo de dados. A coluna é definida pelo valor apropriado de zero para o tipo.

* Para exemplos de `INSERT` que envolvem valores de colunas `AUTO_INCREMENT`, consulte a Seção 5.6.9, “Usando AUTO_INCREMENT”.

  Se o `INSERT` insere uma linha em uma tabela que tem uma coluna `AUTO_INCREMENT`, você pode encontrar o valor usado para essa coluna usando a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`.

  Nota

Essas duas funções nem sempre se comportam da mesma maneira. O comportamento das instruções `INSERT` em relação às colunas `AUTO_INCREMENT` é discutido mais detalhadamente na Seção 14.15, “Funções de Informação”, e no mysql_insert_id().

A instrução `INSERT` suporta os seguintes modificadores:

* Se você usar o modificador `LOW_PRIORITY`, a execução da `INSERT` é adiada até que nenhum outro cliente esteja lendo a tabela. Isso inclui outros clientes que começaram a ler enquanto os clientes existentes estão lendo, e enquanto a instrução `INSERT LOW_PRIORITY` estiver esperando. Portanto, é possível que um cliente que emite uma instrução `INSERT LOW_PRIORITY` precise esperar muito tempo.

  `LOW_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  Nota

  `LOW_PRIORITY` normalmente não deve ser usado com tabelas `MyISAM` porque isso desabilita as inserções concorrentes. Veja a Seção 10.11.3, “Inserções Concorrentes”.

* Se você especificar `HIGH_PRIORITY`, ele substitui o efeito da opção `--low-priority-updates` se o servidor foi iniciado com essa opção. Também faz com que as inserções concorrentes não sejam usadas. Veja a Seção 10.11.3, “Inserções Concorrentes”.

  `HIGH_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

* Se você usar o modificador `IGNORE`, erros ignoráveis que ocorrem durante a execução da instrução `INSERT` são ignorados. Por exemplo, sem `IGNORE`, uma linha que duplica um valor existente de `UNIQUE` ou `PRIMARY KEY` na tabela causa um erro de chave duplicada. Com `IGNORE`, a linha é descartada e não ocorre nenhum erro. Erros ignorados geram avisos em vez disso.

`IGNORE` tem um efeito semelhante em inserções em tabelas particionadas onde não é encontrado nenhuma partição que corresponda a um valor dado. Sem `IGNORE`, essas instruções `INSERT` são abortadas com um erro. Quando `INSERT IGNORE` é usado, a operação de inserção falha silenciosamente para as linhas que contêm o valor não correspondente, mas insere as linhas que são correspondentes. Para um exemplo, veja a Seção 26.2.2, “LIST Partitioning”.

As conversões de dados que acionariam erros abortariam a instrução se `IGNORE` não for especificado. Com `IGNORE`, os valores inválidos são ajustados aos valores mais próximos e inseridos; são produzidos avisos, mas a instrução não é abortada. Você pode determinar com a função C `mysql_info()` quantos registros foram realmente inseridos na tabela.

Para mais informações, veja O Efeito de IGNORE na Execução da Instrução.

Você pode usar `REPLACE` em vez de `INSERT` para sobrescrever linhas antigas. `REPLACE` é o correspondente de `INSERT IGNORE` no tratamento de novas linhas que contêm valores de chave única que duplicam linhas antigas: As novas linhas substituem as linhas antigas em vez de serem descartadas. Veja a Seção 15.2.12, “Instrução REPLACE”.

* Se você especificar `ON DUPLICATE KEY UPDATE` e uma linha for inserida que causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre uma `UPDATE` da linha antiga. O valor de linhas afetadas por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar o sinalizador `CLIENT_FOUND_ROWS` para a função C `mysql_real_connect()` ao se conectar ao **mysqld**, o valor de linhas afetadas é 1 (não 0) se uma linha existente for definida com seus valores atuais. Veja a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

* `INSERT DELAYED` foi descontinuado no MySQL 5.6 e está previsto para ser removido futuramente. No MySQL 9.5, o modificador `DELAYED` é aceito, mas ignorado. Use `INSERT` (sem `DELAYED`) em vez disso. Veja a Seção 15.2.7.3, “Instrução INSERT DELAYED”.