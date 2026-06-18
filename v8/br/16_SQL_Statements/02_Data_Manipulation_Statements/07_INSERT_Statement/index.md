### 15.2.7 Instrução INSERT

15.2.7.1 INSERIR ... Instrução SELECT

15.2.7.2 INSERIR ... na declaração DUPLICATE KEY UPDATE

15.2.7.3 Declaração de adiamento INSERT

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

`INSERT` insere novas linhas em uma tabela existente. As formas `INSERT ... VALUES`, `INSERT ... VALUES ROW()` e `INSERT ... SET` da declaração inserem linhas com base em valores especificados explicitamente. A forma `INSERT ... SELECT` insere linhas selecionadas de outra(s) tabela(s). Você também pode usar `INSERT ... TABLE` no MySQL 8.0.19 e versões posteriores para inserir linhas de uma única tabela. `INSERT` com uma cláusula `ON DUPLICATE KEY UPDATE` permite que as linhas existentes sejam atualizadas se uma linha a ser inserida causasse um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`. No MySQL 8.0.19 e versões posteriores, um alias de linha com um ou mais aliases de coluna opcionais pode ser usado com `ON DUPLICATE KEY UPDATE` para referenciar a linha a ser inserida.

Para obter informações adicionais sobre `INSERT ... SELECT` e `INSERT ... ON DUPLICATE KEY UPDATE`, consulte a Seção 15.2.7.1, “Instrução INSERT ... SELECT”, e a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

No MySQL 8.0, a palavra-chave `DELAYED` é aceita, mas ignorada pelo servidor. Para saber as razões disso, consulte a Seção 15.2.7.3, “Instrução INSERT DELAYED”.

Para inserir em uma tabela, é necessário o privilégio `INSERT` para a tabela. Se a cláusula `ON DUPLICATE KEY UPDATE` for usada e uma chave duplicada causar a execução de um `UPDATE`, a instrução requer o privilégio `UPDATE` para as colunas serem atualizadas. Para colunas que são lidas, mas não modificadas, você precisa apenas do privilégio `SELECT` (como para uma coluna referenciada apenas no lado direito de uma atribuição `col_name`=`expr` em uma cláusula `ON DUPLICATE KEY UPDATE`).

Ao inserir em uma tabela particionada, você pode controlar quais particionações e subparticionações aceitam novas linhas. A cláusula `PARTITION` recebe uma lista de nomes separados por vírgula de uma ou mais particionações ou subparticionações (ou ambas) da tabela. Se alguma das linhas a serem inseridas por uma declaração `INSERT` não corresponder a uma das particionações listadas, a declaração `INSERT` falhará com o erro "Encontrou uma linha que não corresponde ao conjunto de particionações fornecido". Para obter mais informações e exemplos, consulte a Seção 26.5, “Seleção de particionações”.

`tbl_name` é a tabela na qual as linhas devem ser inseridas. Especifique as colunas para as quais a declaração fornece valores da seguinte forma:

- Forneça uma lista entre parênteses com os nomes das colunas separados por vírgula, após o nome da tabela. Neste caso, um valor para cada coluna nomeada deve ser fornecido pela lista `VALUES`, lista `VALUES ROW()` ou a declaração `SELECT`. Para o formulário `INSERT TABLE`, o número de colunas na tabela de origem deve corresponder ao número de colunas a serem inseridas.

- Se você não especificar uma lista de nomes de colunas para `INSERT ... VALUES` ou `INSERT ... SELECT`, os valores de todas as colunas da tabela devem ser fornecidos pela lista `VALUES`, pela declaração `SELECT` ou pela declaração `TABLE`. Se você não sabe a ordem das colunas na tabela, use `DESCRIBE tbl_name` para descobrir.

- Uma cláusula `SET` indica as colunas explicitamente pelo nome, juntamente com o valor a ser atribuído a cada uma.

Os valores das colunas podem ser fornecidos de várias maneiras:

- Se o modo SQL rigoroso não estiver habilitado, qualquer coluna que não seja explicitamente atribuída um valor será definida pelo seu valor padrão (explícito ou implícito). Por exemplo, se você especificar uma lista de colunas que não nomeia todas as colunas da tabela, as colunas não nomeadas serão definidas pelos seus valores padrão. A atribuição de valores padrão é descrita na Seção 13.6, “Valores padrão de tipo de dados”. Veja também a Seção 1.6.3.3, “Restrições obrigatórias para dados inválidos”.

  Se o modo SQL rigoroso estiver ativado, uma instrução `INSERT` gera um erro se não especificar um valor explícito para cada coluna que não tenha um valor padrão. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

- Se a lista de colunas e a lista `VALUES` estiverem vazias, o `INSERT` cria uma linha com cada coluna definida com seu valor padrão:

  ```
  INSERT INTO tbl_name () VALUES();
  ```

  Se o modo rigoroso não estiver habilitado, o MySQL usa o valor padrão implícito para qualquer coluna que não tenha um valor padrão definido explicitamente. Se o modo rigoroso estiver habilitado, ocorrerá um erro se qualquer coluna não tiver um valor padrão.

- Use a palavra-chave `DEFAULT` para definir explicitamente uma coluna para seu valor padrão. Isso facilita a escrita de instruções `INSERT` que atribuem valores a todas as colunas, exceto algumas, pois permite evitar a escrita de uma lista `VALUES` incompleta que não inclui um valor para cada coluna da tabela. Caso contrário, você deve fornecer a lista de nomes de colunas correspondentes a cada valor na lista `VALUES`.

- Se uma coluna gerada for inserida explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”.

- Nas expressões, você pode usar `DEFAULT(col_name)` para produzir o valor padrão para a coluna `col_name`.

- A conversão de tipo de uma expressão `expr` que fornece um valor de coluna pode ocorrer se o tipo de dados da expressão não corresponder ao tipo de dados da coluna. A conversão de um valor dado pode resultar em diferentes valores inseridos, dependendo do tipo da coluna. Por exemplo, inserir a string `'1999.0e-2'` em uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `FLOAT` - FLOAT, DOUBLE"), `DECIMAL(10,6)` - DECIMAL, NUMERIC"), ou `YEAR` insere o valor `1999`, `19.9921`, `19.992100` ou `1999`, respectivamente. O valor armazenado nas colunas `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `YEAR` é `1999`, porque a conversão de string para número só analisa a parte inicial da string que possa ser considerada um inteiro ou ano válido. Para as colunas `FLOAT` - FLOAT, DOUBLE") e `DECIMAL` - DECIMAL, NUMERIC"), a conversão de string para número considera toda a string como um valor numérico válido.

- Uma expressão `expr` pode se referir a qualquer coluna que foi definida anteriormente em uma lista de valores. Por exemplo, você pode fazer isso porque o valor para `col2` se refere a `col1`, que foi previamente atribuído:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

  Mas o seguinte não é legal, porque o valor para `col1` refere-se a `col2`, que é atribuído após `col1`:

  ```
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

  Uma exceção ocorre para as colunas que contêm valores `AUTO_INCREMENT`. Como os valores `AUTO_INCREMENT` são gerados após outras atribuições de valores, qualquer referência a uma coluna `AUTO_INCREMENT` na atribuição retorna um `0`.

As declarações `INSERT` que utilizam a sintaxe `VALUES` podem inserir múltiplas linhas. Para fazer isso, inclua múltiplas listas de valores de coluna separados por vírgula, com listas dentro de parênteses e separadas por vírgulas. Exemplo:

```
INSERT INTO tbl_name (a,b,c)
    VALUES(1,2,3), (4,5,6), (7,8,9);
```

Cada lista de valores deve conter exatamente tantos valores quanto forem inseridos por linha. A seguinte declaração é inválida porque contém uma lista de nove valores, em vez de três listas de três valores cada:

```
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` é sinônimo de `VALUES` neste contexto. Nenhum deles implica em nada sobre o número de listas de valores, nem sobre o número de valores por lista. Pode ser usado tanto se houver uma única lista de valores quanto se houver várias listas, e independentemente do número de valores por lista.

As declarações `INSERT` usando a sintaxe `VALUES ROW()` também podem inserir múltiplas linhas. Nesse caso, cada lista de valores deve estar contida dentro de um `ROW()` (construtor de linha), assim:

```
INSERT INTO tbl_name (a,b,c)
    VALUES ROW(1,2,3), ROW(4,5,6), ROW(7,8,9);
```

O valor de affected-rows para um `INSERT` pode ser obtido usando a função SQL `ROW_COUNT()` ou a função C API `mysql_affected_rows()`. Veja a Seção 14.15, “Funções de Informação”, e mysql\_affected\_rows().

Se você usar `INSERT ... VALUES` ou `INSERT ... VALUES ROW()` com listas de valores múltiplos, ou `INSERT ... SELECT` ou `INSERT ... TABLE`, a declaração retorna uma string de informações neste formato:

```
Records: N1 Duplicates: N2 Warnings: N3
```

Se você estiver usando a API C, a string de informações pode ser obtida invocando a função `mysql_info()`. Veja mysql\_info().

`Records` indica o número de linhas processadas pela instrução. (Isso não é necessariamente o número de linhas realmente inseridas, pois `Duplicates` pode ser diferente de zero.) `Duplicates` indica o número de linhas que não puderam ser inseridas porque elas duplicariam algum valor de índice único existente. `Warnings` indica o número de tentativas de inserir valores de coluna que foram problemáticos de alguma forma. As advertências podem ocorrer sob qualquer uma das seguintes condições:

- Inserir `NULL` em uma coluna que tenha sido declarada como `NOT NULL`. Para instruções de múltiplas linhas `INSERT` ou instruções `INSERT INTO ... SELECT`, a coluna é definida pelo valor padrão implícito para o tipo de dados da coluna. Isso é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor “zero” para tipos de data e hora. As instruções `INSERT INTO ... SELECT` são tratadas da mesma maneira que as inserções de múltiplas linhas porque o servidor não examina o conjunto de resultados da instrução `SELECT` para ver se ela retorna uma única linha. (Para uma única linha `INSERT`, não há aviso quando `NULL` é inserido em uma coluna `NOT NULL`. Em vez disso, a instrução falha com um erro.)

- Definir uma coluna numérica para um valor que esteja fora do intervalo da coluna. O valor é recortado para o ponto final mais próximo do intervalo.

- Atribuir um valor como `'10.34 a'` a uma coluna numérica. O texto não numérico final é removido e a parte numérica restante é inserida. Se o valor da string não tiver uma parte numérica inicial, a coluna é definida como `0`.

- Inserir uma string em uma coluna de string (`CHAR`, `VARCHAR`, `TEXT` ou `BLOB`) que exceda o comprimento máximo da coluna. O valor é truncado para o comprimento máximo da coluna.

- Inserir um valor em uma coluna de data ou hora que seja ilegal para o tipo de dados. A coluna é definida com o valor zero apropriado para o tipo.

- Para exemplos de `INSERT` que envolvem valores da coluna `AUTO_INCREMENT`, consulte a Seção 5.6.9, “Usando AUTO\_INCREMENT”.

  Se `INSERT` inserir uma linha em uma tabela que possui uma coluna `AUTO_INCREMENT`, você pode encontrar o valor usado para essa coluna usando a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`.

  Nota

  Essas duas funções nem sempre se comportam da mesma maneira. O comportamento das instruções `INSERT` em relação às colunas `AUTO_INCREMENT` é discutido mais detalhadamente na Seção 14.15, “Funções de Informação”, e em mysql\_insert\_id().

A declaração `INSERT` suporta os seguintes modificadores:

- Se você usar o modificador `LOW_PRIORITY`, a execução do `INSERT` será adiada até que nenhum outro cliente esteja lendo da tabela. Isso inclui outros clientes que começaram a ler enquanto clientes existentes estão lendo e enquanto a instrução `INSERT LOW_PRIORITY` está esperando. Portanto, é possível que um cliente que emite uma instrução `INSERT LOW_PRIORITY` espere por um tempo muito longo.

  `LOW_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  Nota

  `LOW_PRIORITY` normalmente não deve ser usado com tabelas `MyISAM` porque isso desabilita as inserções concorrentes. Veja a Seção 10.11.3, “Inserções Concorrentes”.

- Se você especificar `HIGH_PRIORITY`, ele substitui o efeito da opção `--low-priority-updates` se o servidor foi iniciado com essa opção. Ele também impede que as inserções concorrentes sejam usadas. Veja a Seção 10.11.3, “Inserções Concorrentes”.

  `HIGH_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- Se você usar o modificador `IGNORE`, erros ignoráveis que ocorrem durante a execução da instrução `INSERT` são ignorados. Por exemplo, sem `IGNORE`, uma linha que duplica um índice existente de `UNIQUE` ou um valor de `PRIMARY KEY` na tabela causa um erro de chave duplicada e a instrução é interrompida. Com `IGNORE`, a linha é descartada e não ocorre nenhum erro. Os erros ignorados geram avisos em vez disso.

  `IGNORE` tem um efeito semelhante em inserções em tabelas particionadas onde não é encontrado nenhuma partição que corresponda a um valor dado. Sem `IGNORE`, tais instruções `INSERT` são abortadas com um erro. Quando `INSERT IGNORE` é usado, a operação de inserção falha silenciosamente para linhas que contêm o valor não correspondente, mas insere linhas que são correspondentes. Para um exemplo, veja a Seção 26.2.2, “LIST Partitioning”.

  As conversões de dados que acionariam erros abortariam a declaração se `IGNORE` não for especificado. Com `IGNORE`, valores inválidos são ajustados para os valores mais próximos e inseridos; são gerados avisos, mas a declaração não é abortada. Você pode determinar com a função C API `mysql_info()` quantas linhas foram realmente inseridas na tabela.

  Para obter mais informações, consulte O efeito de IGNORE na execução da declaração.

  Você pode usar `REPLACE` em vez de `INSERT` para sobrescrever linhas antigas. `REPLACE` é o equivalente de `INSERT IGNORE` no tratamento de novas linhas que contêm valores de chave únicos que duplicam linhas antigas: As novas linhas substituem as linhas antigas, em vez de serem descartadas. Veja a Seção 15.2.12, “Instrução REPLACE”.

- Se você especificar `ON DUPLICATE KEY UPDATE` e uma linha for inserida que causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, um `UPDATE` da linha antiga ocorre. O valor affected-rows por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS` para a função C API `mysql_real_connect()` ao se conectar ao **mysqld**, o valor affected-rows é 1 (não 0) se uma linha existente for definida com seus valores atuais. Veja a Seção 15.2.7.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

- `INSERT DELAYED` foi descontinuado no MySQL 5.6 e está previsto para ser removido futuramente. No MySQL 8.0, o modificador `DELAYED` é aceito, mas ignorado. Use `INSERT` (sem `DELAYED`) em vez disso. Veja a Seção 15.2.7.3, “Instrução INSERT DELAYED”.
