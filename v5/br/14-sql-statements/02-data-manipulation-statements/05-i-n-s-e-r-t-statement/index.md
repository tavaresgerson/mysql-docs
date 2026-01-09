### 13.2.5 Instrução INSERT

13.2.5.1 INSERIR ... Instrução SELECT

13.2.5.2 INSERIR ... na declaração DUPLICATE KEY UPDATE

13.2.5.3 Declaração de adiamento do INSERT

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

`INSERT` insere novas linhas em uma tabela existente. As formas `INSERT ... VALUES` e `INSERT ... SET` da instrução inserem linhas com base em valores especificados explicitamente. A forma `INSERT ... SELECT` insere linhas selecionadas de outra(s) tabela(s). O `INSERT` com uma cláusula `ON DUPLICATE KEY UPDATE` permite que as linhas existentes sejam atualizadas se uma linha a ser inserida causar um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`.

Para obter informações adicionais sobre `INSERT ... SELECT` e `INSERT ... ON DUPLICATE KEY UPDATE`, consulte Seção 13.2.5.1, “Instrução INSERT ... SELECT” e Seção 13.2.5.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

No MySQL 5.7, a palavra-chave `DELAYED` é aceita, mas ignorada pelo servidor. Para saber as razões disso, consulte Seção 13.2.5.3, “Instrução INSERT DELAYED”,

Para inserir em uma tabela, é necessário o privilégio `INSERT` para a tabela. Se a cláusula `ON DUPLICATE KEY UPDATE` for usada e uma chave duplicada causar a execução de uma atualização (`UPDATE` em vez disso), a instrução requer o privilégio `UPDATE`]\(privileges-provided.html#priv_update) para as colunas serem atualizadas. Para colunas que são lidas, mas não modificadas, você precisa apenas do privilégio `SELECT`]\(privileges-provided.html#priv_select) (como para uma coluna referenciada apenas no lado direito de uma atribuição *`col_name`*=*`expr`* em uma cláusula `ON DUPLICATE KEY UPDATE`).

Ao inserir em uma tabela particionada, você pode controlar quais particionações e subparticionações aceitam novas linhas. A cláusula `PARTITION` recebe uma lista de nomes separados por vírgula de uma ou mais particionações ou subparticionações (ou ambas) da tabela. Se alguma das linhas a serem inseridas por uma declaração `INSERT` (insert.html) não corresponder a uma das particionações listadas, a declaração `INSERT` falha com o erro "Encontrou uma linha que não corresponde ao conjunto de particionações fornecido". Para mais informações e exemplos, consulte Seção 22.5, "Seleção de particionações".

*`tbl_name`* é a tabela na qual as linhas devem ser inseridas. Especifique as colunas para as quais a declaração fornece valores da seguinte forma:

- Forneça uma lista entre parênteses com os nomes das colunas separados por vírgula, após o nome da tabela. Nesse caso, um valor para cada coluna nomeada deve ser fornecido pela lista `VALUES` ou pela instrução `SELECT`.

- Se você não especificar uma lista de nomes de colunas para `INSERT ... VALUES` ou `INSERT ... SELECT`, os valores para cada coluna da tabela devem ser fornecidos pela lista `VALUES` ou pela instrução `SELECT`. Se você não conhece a ordem das colunas na tabela, use `DESCRIBE tbl_name` para descobrir.

- Uma cláusula `SET` indica colunas explicitamente por nome, juntamente com o valor a ser atribuído a cada uma.

Os valores das colunas podem ser fornecidos de várias maneiras:

- Se o modo SQL rigoroso não estiver habilitado, qualquer coluna que não receber um valor explícito será definida pelo seu valor padrão (explícito ou implícito). Por exemplo, se você especificar uma lista de colunas que não nomeia todas as colunas da tabela, as colunas não nomeadas serão definidas pelos seus valores padrão. A atribuição de valores padrão é descrita em Seção 11.6, “Valores padrão de tipo de dados”. Veja também Seção 1.6.3.3, “Restrições para dados inválidos”.

  Se o modo SQL rigoroso estiver ativado, uma instrução `INSERT` gera um erro se não especificar um valor explícito para cada coluna que não tenha um valor padrão. Veja Seção 5.1.10, “Modos SQL do Servidor”.

- Se a lista de colunas e a lista de `VALUES` estiverem vazias, o `INSERT` cria uma linha com cada coluna definida com seu valor padrão:

  ```sql
  INSERT INTO tbl_name () VALUES();
  ```

  Se o modo rigoroso não estiver habilitado, o MySQL usa o valor padrão implícito para qualquer coluna que não tenha um valor padrão definido explicitamente. Se o modo rigoroso estiver habilitado, ocorrerá um erro se qualquer coluna não tiver um valor padrão.

- Use a palavra-chave `DEFAULT` para definir explicitamente uma coluna para seu valor padrão. Isso facilita a escrita de instruções de `INSERT` (inserção.html) que atribuem valores a todas as colunas, exceto algumas, pois permite evitar a escrita de uma lista `VALUES` incompleta que não inclui um valor para cada coluna da tabela. Caso contrário, você deve fornecer a lista de nomes de colunas correspondentes a cada valor na lista `VALUES`.

- Se uma coluna gerada for inserida explicitamente, o único valor permitido é `DEFAULT`. Para obter informações sobre colunas geradas, consulte Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

- Nas expressões, você pode usar `DEFAULT(col_name)` para gerar o valor padrão para a coluna *`col_name`*.

- A conversão de tipo de uma expressão *`expr`* que fornece um valor de coluna pode ocorrer se o tipo de dados da expressão não corresponder ao tipo de dados da coluna. A conversão de um valor dado pode resultar em diferentes valores inseridos, dependendo do tipo da coluna. Por exemplo, inserir a string `'1999.0e-2'` em uma coluna de tipo `INT`, `FLOAT`, `DECIMAL(10,6)` ou `YEAR` insere o valor `1999`, `19.9921`, `19.992100` ou `1999`, respectivamente. O valor armazenado nas colunas de tipo `INT` e `YEAR` é `1999` porque a conversão de string para número analisa apenas a parte inicial da string que pode ser considerada um inteiro ou ano válido. Para as colunas de tipo `FLOAT` e `DECIMAL`, a conversão de string para número considera toda a string como um valor numérico válido.

- Uma expressão *`expr`* pode se referir a qualquer coluna que tenha sido definida anteriormente em uma lista de valores. Por exemplo, você pode fazer isso porque o valor para `col2` se refere a `col1`, que foi previamente atribuído:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

  Mas o seguinte não é legal, porque o valor para `col1` refere-se a `col2`, que é atribuído após `col1`:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

  Uma exceção ocorre para as colunas que contêm valores `AUTO_INCREMENT`. Como os valores `AUTO_INCREMENT` são gerados após outras atribuições de valores, qualquer referência a uma coluna `AUTO_INCREMENT` na atribuição retorna um `0`.

As instruções `INSERT` que usam a sintaxe `VALUES` podem inserir várias linhas. Para fazer isso, inclua várias listas de valores de coluna separados por vírgula, com listas dentro de parênteses e separadas por vírgulas. Exemplo:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3),(4,5,6),(7,8,9);
```

Cada lista de valores deve conter exatamente tantos valores quanto forem inseridos por linha. A seguinte declaração é inválida porque contém uma lista de nove valores, em vez de três listas de três valores cada:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` é sinônimo de `VALUES` neste contexto. Nenhum deles implica em nada sobre o número de listas de valores, nem sobre o número de valores por lista. Pode ser usado tanto se houver uma única lista de valores quanto se houver várias listas, e independentemente do número de valores por lista.

O valor de `affected-rows` para um `INSERT` pode ser obtido usando a função SQL `[ROW_COUNT()`]\(information-functions.html#function_row-count) ou a função C API `[mysql_affected_rows()`]\(/doc/c-api/5.7/en/mysql-affected-rows.html). Veja Seção 12.15, “Funções de Informação” e mysql_affected_rows().

Se você usar uma instrução `INSERT ... VALUES` (insert.html) com várias listas de valores ou `INSERT ... SELECT` (insert-select.html), a instrução retorna uma string de informações no seguinte formato:

```sql
Records: N1 Duplicates: N2 Warnings: N3
```

Se você estiver usando a API C, a string de informações pode ser obtida invocando a função `mysql_info()`. Veja mysql_info().

`Registros` indica o número de linhas processadas pela declaração. (Isso não é necessariamente o número de linhas realmente inseridas, pois `Duplicatas` pode ser diferente de zero.) `Duplicatas` indica o número de linhas que não puderam ser inseridas porque elas duplicariam algum valor de índice único existente. `Avisos` indica o número de tentativas de inserir valores de coluna que foram problemáticos de alguma forma. Os avisos podem ocorrer sob qualquer uma das seguintes condições:

- Inserindo `NULL` em uma coluna que foi declarada como `NOT NULL`. Para instruções de inserção de múltiplas linhas `INSERT` ou instruções de inserção em `INSERT INTO ... SELECT`(insert-select.html), a coluna é definida pelo valor padrão implícito para o tipo de dados da coluna. Isso é `0` para tipos numéricos, a string vazia (`''`) para tipos de string e o valor "zero" para tipos de data e hora. As instruções de inserção em `INSERT INTO ... SELECT`(insert-select.html) são tratadas da mesma maneira que as inserções de múltiplas linhas porque o servidor não examina o conjunto de resultados da instrução `SELECT`(select.html) para ver se ela retorna uma única linha. (Para uma inserção de uma única linha `INSERT`, não há aviso quando `NULL` é inserido em uma coluna `NOT NULL`. Em vez disso, a instrução falha com um erro.)

- Definir uma coluna numérica para um valor que esteja fora do intervalo da coluna. O valor é recortado para o ponto final mais próximo do intervalo.

- Atribuir um valor como `'10,34 a'` a uma coluna numérica. O texto não numérico final é removido e a parte numérica restante é inserida. Se o valor da string não tiver uma parte numérica inicial, a coluna é definida como `0`.

- Inserir uma cadeia de caracteres em uma coluna de cadeia de caracteres (`CHAR`, `VARCHAR`, `TEXT` ou `BLOB`) que exceda o comprimento máximo da coluna. O valor é truncado para o comprimento máximo da coluna.

- Inserir um valor em uma coluna de data ou hora que seja ilegal para o tipo de dados. A coluna é definida com o valor zero apropriado para o tipo.

- Para exemplos de `INSERT` que envolvem valores de colunas `AUTO_INCREMENT`, consulte Seção 3.6.9, “Usando AUTO_INCREMENT”.

  Se `INSERT` inserir uma linha em uma tabela que possui uma coluna `AUTO_INCREMENT`, você pode encontrar o valor usado para essa coluna usando a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`.

  Nota

  Essas duas funções nem sempre se comportam da mesma maneira. O comportamento das instruções `INSERT` em relação às colunas `AUTO_INCREMENT` é discutido mais detalhadamente em Seção 12.15, “Funções de Informação” e mysql_insert_id().

A instrução `INSERT` suporta os seguintes modificadores:

- Se você usar o modificador `LOW_PRIORITY`, a execução da instrução `INSERT` será adiada até que nenhum outro cliente esteja lendo da tabela. Isso inclui outros clientes que começaram a ler enquanto clientes existentes estão lendo e enquanto a instrução `INSERT LOW_PRIORITY` estiver esperando. Portanto, é possível que um cliente que emite uma instrução `INSERT LOW_PRIORITY` precise esperar por um tempo muito longo.

  `LOW_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  Nota

  `LOW_PRIORITY` normalmente não deve ser usado com tabelas `MyISAM`, pois isso desabilita as inserções concorrentes. Veja Seção 8.11.3, “Inserções Concorrentes”.

- Se você especificar `HIGH_PRIORITY`, ele substitui o efeito da opção `--low-priority-updates` (server-system-variables.html#sysvar_low_priority_updates) se o servidor foi iniciado com essa opção. Isso também faz com que as inserções concorrentes não sejam usadas. Veja Seção 8.11.3, “Inserções Concorrentes”.

  `HIGH_PRIORITY` afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- Se você usar o modificador `IGNORE`, erros ignoráveis que ocorrem durante a execução da instrução `INSERT` são ignorados. Por exemplo, sem `IGNORE`, uma linha que duplica um índice `UNIQUE` ou um valor `PRIMARY KEY` existente na tabela causa um erro de chave duplicada e a instrução é interrompida. Com `IGNORE`, a linha é descartada e nenhum erro ocorre. Erros ignorados geram avisos em vez disso.

  `IGNORE` tem um efeito semelhante em inserções em tabelas particionadas onde não é encontrado nenhuma partição que corresponda a um valor dado. Sem `IGNORE`, tais instruções de `INSERT` (insert.html) são abortadas com um erro. Quando `INSERT IGNORE` (insert.html) é usado, a operação de inserção falha silenciosamente para linhas que contêm o valor não correspondente, mas insere linhas que são correspondentes. Para um exemplo, veja Seção 22.2.2, “LIST Partitioning”.

  Conversões de dados que acionariam erros interromperiam a declaração se o `IGNORE` não for especificado. Com `IGNORE`, os valores inválidos são ajustados aos valores mais próximos e inseridos; são gerados avisos, mas a declaração não é interrompida. Você pode determinar com a função C API `mysql_info()` quantos registros foram realmente inseridos na tabela.

  Para mais informações, consulte O efeito de IGNORE na execução da declaração.

  Você pode usar `REPLACE` em vez de `INSERT` para sobrescrever linhas antigas. `REPLACE` é o equivalente a `INSERT IGNORE` no tratamento de novas linhas que contêm valores de chave únicos que duplicam linhas antigas: As novas linhas substituem as linhas antigas em vez de serem descartadas. Veja Seção 13.2.8, “Instrução REPLACE”.

- Se você especificar `ON DUPLICATE KEY UPDATE` e uma linha for inserida que causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre uma atualização (`UPDATE`) da linha antiga. O valor affected-rows por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS` na função C API `mysql_real_connect()` ao se conectar ao **mysqld**, o valor affected-rows é 1 (não 0) se uma linha existente for definida com seus valores atuais. Veja Seção 13.2.5.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”.

- `INSERT DELAYED` foi descontinuado no MySQL 5.6 e está previsto para ser removido eventualmente. No MySQL 5.7, o modificador `DELAYED` é aceito, mas ignorado. Use `INSERT` (sem `DELAYED`). Veja Seção 13.2.5.3, “Instrução INSERT DELAYED”.

Uma instrução `INSERT` que afeta uma tabela particionada usando um mecanismo de armazenamento como `MyISAM`, que emprega bloqueios de nível de tabela, bloqueia apenas as partições nas quais as linhas são realmente inseridas. (Para mecanismos de armazenamento como `InnoDB`, que empregam bloqueios de nível de linha, não ocorre bloqueio de partições.) Para mais informações, consulte Seção 22.6.4, “Particionamento e Bloqueio”.
