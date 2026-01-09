### 13.2.9 Instrução SELECT

13.2.9.1 Declaração SELECT ... INTO

13.2.9.2 Cláusula JOIN

13.2.9.3 Cláusula de UNIÃO

```sql
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY]
    [STRAIGHT_JOIN]
    [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_CACHE | SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr] ...
    [into_option]
    [FROM table_references
      [PARTITION partition_list]]
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP]]
    [HAVING where_condition]
    [ORDER BY {col_name | expr | position}
      [ASC | DESC], ...]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [PROCEDURE procedure_name(argument_list)]
    [into_option]
    [FOR UPDATE | LOCK IN SHARE MODE]

into_option: {
    INTO OUTFILE 'file_name'
        [CHARACTER SET charset_name]
        export_options
  | INTO DUMPFILE 'file_name'
  | INTO var_name [, var_name] ...
}

export_options:
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
```

`SELECT` é usado para recuperar linhas selecionadas de uma ou mais tabelas e pode incluir instruções `UNION` e subconsultas. Veja Seção 13.2.9.3, “Cláusula UNION” e Seção 13.2.10, “Subconsultas”.

As cláusulas mais comumente usadas das instruções `SELECT` são estas:

- Cada `select_expr` indica uma coluna que você deseja recuperar. Deve haver pelo menos um `select_expr`.

- *`table_references`* indica a(s) tabela(s) a partir da qual as linhas serão recuperadas. Sua sintaxe é descrita em Seção 13.2.9.2, “Cláusula JOIN”.

- O `SELECT` suporta a seleção explícita de partições usando a cláusula `PARTITION` com uma lista de partições ou subpartições (ou ambas) após o nome da tabela em uma *`table_reference`* (veja Seção 13.2.9.2, “Cláusula JOIN”). Neste caso, as linhas são selecionadas apenas das partições listadas, e quaisquer outras partições da tabela são ignoradas. Para mais informações e exemplos, consulte Seção 22.5, “Seleção de Partições”.

  `SELECT ... PARTITION` de tabelas usando motores de armazenamento como `MyISAM` que realizam bloqueios de nível de tabela (e, portanto, bloqueios de partição), bloqueiam apenas as partições ou subpartições nomeadas pela opção `PARTITION`.

  Para mais informações, consulte Seção 22.6.4, “Partição e Bloqueio”.

- A cláusula `WHERE`, se fornecida, indica a condição ou condições que as linhas devem satisfazer para serem selecionadas. *`where_condition`* é uma expressão que avalia como verdadeira para cada linha a ser selecionada. A declaração seleciona todas as linhas se não houver nenhuma cláusula `WHERE`.

  Na expressão `WHERE`, você pode usar qualquer uma das funções e operadores suportados pelo MySQL, exceto as funções agregadas (grupo). Veja Seção 9.5, “Expressões” e Capítulo 12, *Funções e Operadores*.

`SELECT` também pode ser usado para recuperar linhas calculadas sem referência a nenhuma tabela.

Por exemplo:

```sql
mysql> SELECT 1 + 1;
        -> 2
```

Você pode especificar `DUAL` como um nome de tabela fictício em situações em que nenhuma tabela é referenciada:

```sql
mysql> SELECT 1 + 1 FROM DUAL;
        -> 2
```

`DUAL` é puramente para a conveniência das pessoas que exigem que todas as instruções `SELECT` (select.html) tenham `FROM` e, possivelmente, outras cláusulas. O MySQL pode ignorar as cláusulas. O MySQL não exige `FROM DUAL` se nenhuma tabela for referenciada.

Em geral, as cláusulas usadas devem ser fornecidas exatamente na ordem mostrada na descrição da sintaxe. Por exemplo, uma cláusula `HAVING` deve vir após qualquer cláusula `GROUP BY` e antes de qualquer cláusula `ORDER BY`. A cláusula `INTO`, se presente, pode aparecer em qualquer posição indicada pela descrição da sintaxe, mas dentro de uma declaração dada pode aparecer apenas uma vez, não em múltiplas posições. Para mais informações sobre `INTO`, consulte Seção 13.2.9.1, “Instrução SELECT ... INTO”.

A lista de termos *`select_expr`* compreende a lista de seleção que indica quais colunas serão recuperadas. Os termos especificam uma coluna ou expressão ou podem usar a abreviação `*`:

- Uma lista selecionada que contenha apenas um `*` não qualificado pode ser usada como abreviação para selecionar todas as colunas de todas as tabelas:

  ```sql
  SELECT * FROM t1 INNER JOIN t2 ...
  ```

- `tbl_name.*` pode ser usado como uma abreviação qualificada para selecionar todas as colunas da tabela nomeada:

  ```sql
  SELECT t1.*, t2.* FROM t1 INNER JOIN t2 ...
  ```

- O uso de um asterisco não qualificado (`*`) com outros itens na lista de seleção pode gerar um erro de análise. Por exemplo:

  ```sql
  SELECT id, * FROM t1
  ```

  Para evitar esse problema, use uma referência qualificada `tbl_name.*`:

  ```sql
  SELECT id, t1.* FROM t1
  ```

  Use referências qualificadas `tbl_name.*` para cada tabela na lista de seleção:

  ```sql
  SELECT AVG(score), t1.* FROM t1 ...
  ```

A lista a seguir fornece informações adicionais sobre outras cláusulas `SELECT`:

- Um *`select_expr`* pode receber um alias usando `AS alias_name`. O alias é usado como o nome da coluna da expressão e pode ser usado nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING`. Por exemplo:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) AS full_name
    FROM mytable ORDER BY full_name;
  ```

  A palavra-chave `AS` é opcional ao aliar um *`select_expr`* com um identificador. O exemplo anterior poderia ter sido escrito da seguinte forma:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) full_name
    FROM mytable ORDER BY full_name;
  ```

  No entanto, como o `AS` é opcional, pode ocorrer um problema sutil se você esquecer a vírgula entre duas expressões de `select_expr`: o MySQL interpreta a segunda como um nome de alias. Por exemplo, na seguinte declaração, `columnb` é tratado como um nome de alias:

  ```sql
  SELECT columna columnb FROM mytable;
  ```

  Por essa razão, é uma boa prática ter o hábito de usar `AS` explicitamente ao especificar aliases de coluna.

  Não é permitido referenciar um alias de coluna em uma cláusula `WHERE`, porque o valor da coluna pode ainda não estar determinado quando a cláusula `WHERE` for executada. Veja Seção B.3.4.4, “Problemas com aliases de coluna”.

- A cláusula `FROM table_references` indica a(s) tabela(s) a partir da qual as linhas serão recuperadas. Se você nomear mais de uma tabela, está realizando uma junção. Para obter informações sobre a sintaxe de junção, consulte Seção 13.2.9.2, “Cláusula JOIN”. Para cada tabela especificada, você pode opcionalmente especificar um alias.

  ```sql
  tbl_name [[AS] alias] [index_hint]
  ```

  O uso de dicas de índice fornece ao otimizador informações sobre como escolher índices durante o processamento de consultas. Para uma descrição da sintaxe para especificar essas dicas, consulte Seção 8.9.4, “Dicas de Índice”.

  Você pode usar `SET max_seeks_for_key=valor` como uma maneira alternativa de forçar o MySQL a preferir varreduras de chave em vez de varreduras de tabela. Veja Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- Você pode se referir a uma tabela dentro do banco de dados padrão como *`tbl_name`*, ou como *`db_name`*.*`tbl_name`* para especificar um banco de dados explicitamente. Você pode se referir a uma coluna como *`col_name`*, *`tbl_name`*.*`col_name`*, ou *`db_name`*.*`tbl_name`*.*`col_name`*. Você não precisa especificar um *`tbl_name`* ou *`db_name`*.*`tbl_name`* prefixo para uma referência de coluna, a menos que a referência seja ambígua. Consulte Seção 9.2.2, “Qualificadores de Identificador”, para exemplos de ambiguidade que requerem as formas de referência de coluna mais explícitas.

- Uma referência de tabela pode ser aliassificada usando `tbl_name AS alias_name` ou \*`tbl_name alias_name*`. Essas instruções são equivalentes:

  ```sql
  SELECT t1.name, t2.salary FROM employee AS t1, info AS t2
    WHERE t1.name = t2.name;

  SELECT t1.name, t2.salary FROM employee t1, info t2
    WHERE t1.name = t2.name;
  ```

- As colunas selecionadas para saída podem ser referenciadas nas cláusulas `ORDER BY` e `GROUP BY` usando nomes de colunas, aliases de colunas ou posições de colunas. As posições de colunas são inteiros e começam com 1:

  ```sql
  SELECT college, region, seed FROM tournament
    ORDER BY region, seed;

  SELECT college, region AS r, seed AS s FROM tournament
    ORDER BY r, s;

  SELECT college, region, seed FROM tournament
    ORDER BY 2, 3;
  ```

  Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descrescente) ao nome da coluna na cláusula `ORDER BY` pela qual você está ordenando. O padrão é a ordem crescente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`.

  Se o `ORDER BY` ocorrer dentro de uma expressão de consulta entre parênteses e também for aplicado na consulta externa, os resultados serão indefinidos e podem mudar em uma futura versão do MySQL.

  O uso de posições de coluna é desaconselhado porque a sintaxe foi removida do padrão SQL.

- O MySQL estende a cláusula `GROUP BY` para que você possa especificar `ASC` e `DESC` após as colunas mencionadas na cláusula. No entanto, essa sintaxe está desatualizada. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

- Se você usar `GROUP BY`, as linhas de saída serão ordenadas de acordo com as colunas `GROUP BY`, como se você tivesse uma `ORDER BY` para as mesmas colunas. Para evitar o overhead da ordenação que o `GROUP BY` produz, adicione `ORDER BY NULL`:

  ```sql
  SELECT a, COUNT(b) FROM test_table GROUP BY a ORDER BY NULL;
  ```

  Depender da classificação implícita do `GROUP BY` (ou seja, classificar na ausência de designadores `ASC` ou `DESC`) ou da classificação explícita para `GROUP BY` (ou seja, usando designadores `ASC` ou `DESC` explícitos para as colunas `GROUP BY`) está desaconselhável. Para produzir um determinado ordem de classificação, forneça uma cláusula `ORDER BY`.

- Quando você usa `ORDER BY` ou `GROUP BY` para ordenar uma coluna em uma consulta `SELECT`, o servidor ordena os valores usando apenas o número inicial de bytes indicado pela variável de sistema `max_sort_length` (server-system-variables.html#sysvar_max_sort_length).

- O MySQL estende o uso do `GROUP BY` para permitir a seleção de campos que não são mencionados na cláusula `GROUP BY`. Se você não está obtendo os resultados esperados da sua consulta, por favor, leia a descrição do `GROUP BY` encontrada em Seção 12.19, “Funções Agregadas”.

- O comando `GROUP BY` permite o modificador `WITH ROLLUP`. Veja Seção 12.19.2, “Modificadores GROUP BY”.

- A cláusula `HAVING`, assim como a cláusula `WHERE`, especifica condições de seleção. A cláusula `WHERE` especifica condições sobre as colunas na lista de seleção, mas não pode referir-se a funções agregadas. A cláusula `HAVING` especifica condições sobre grupos, tipicamente formados pela cláusula `GROUP BY`. O resultado da consulta inclui apenas os grupos que satisfazem as condições `HAVING`. (Se não houver `GROUP BY`, todas as linhas implicitamente formam um único grupo agregado.)

  A cláusula `HAVING` é aplicada quase no final, logo antes de os itens serem enviados ao cliente, sem otimização. (`LIMIT` é aplicado após `HAVING`.

  O padrão SQL exige que `HAVING` se refira apenas a colunas da cláusula `GROUP BY` ou a colunas usadas em funções agregadas. No entanto, o MySQL suporta uma extensão a esse comportamento e permite que `HAVING` se refira a colunas na lista `SELECT` e a colunas em subconsultas externas também.

  Se a cláusula `HAVING` se refere a uma coluna ambígua, um aviso é exibido. Na seguinte declaração, `col2` é ambígua porque é usada tanto como um alias quanto como um nome de coluna:

  ```sql
  SELECT COUNT(col1) AS col2 FROM t GROUP BY col2 HAVING col2 = 2;
  ```

  A preferência é dada ao comportamento padrão do SQL, portanto, se o nome de uma coluna `HAVING` for usado tanto no `GROUP BY` quanto como uma coluna aliased na lista de colunas do select, a preferência é dada à coluna no `GROUP BY`.

- Não use `HAVING` para itens que devem estar na cláusula `WHERE`. Por exemplo, não escreva o seguinte:

  ```sql
  SELECT col_name FROM tbl_name HAVING col_name > 0;
  ```

  Escreva o seguinte em vez disso:

  ```sql
  SELECT col_name FROM tbl_name WHERE col_name > 0;
  ```

- A cláusula `HAVING` pode se referir a funções agregadas, que a cláusula `WHERE` não pode:

  ```sql
  SELECT user, MAX(salary) FROM users
    GROUP BY user HAVING MAX(salary) > 10;
  ```

  (Isso não funcionou em algumas versões mais antigas do MySQL.)

- O MySQL permite nomes de colunas duplicados. Ou seja, pode haver mais de um *`select_expr`* com o mesmo nome. Isso é uma extensão do SQL padrão. Como o MySQL também permite que `GROUP BY` e `HAVING` se refiram aos valores de *`select_expr`*, isso pode resultar em uma ambiguidade:

  ```sql
  SELECT 12 AS a, a FROM t GROUP BY a;
  ```

  Naquela declaração, ambas as colunas têm o nome `a`. Para garantir que a coluna correta seja usada para o agrupamento, use nomes diferentes para cada *`select_expr`*.

- O MySQL resolve referências de coluna não qualificadas ou aliases nas cláusulas `ORDER BY` procurando nos valores de *`select_expr`*, depois nas colunas das tabelas na cláusula `FROM`. Para as cláusulas `GROUP BY` ou `HAVING`, ele procura na cláusula `FROM` antes de procurar nos valores de *`select_expr`*. (Para `GROUP BY` e `HAVING`, isso difere do comportamento anterior ao MySQL 5.0, que usava as mesmas regras que para `ORDER BY`.)

- A cláusula `LIMIT` pode ser usada para restringir o número de linhas retornadas pela instrução `SELECT`. `LIMIT` aceita um ou dois argumentos numéricos, que devem ser constantes inteiras não negativas, com essas exceções:

  - Dentro das declarações preparadas, os parâmetros `LIMIT` podem ser especificados usando marcadores de substituição `?`.

  - Nos programas armazenados, os parâmetros `LIMIT` podem ser especificados usando parâmetros de rotina com valores inteiros ou variáveis locais.

  Com dois argumentos, o primeiro argumento especifica o deslocamento da primeira linha a ser retornada, e o segundo especifica o número máximo de linhas a ser retornado. O deslocamento da linha inicial é 0 (não 1):

  ```sql
  SELECT * FROM tbl LIMIT 5,10;  # Retrieve rows 6-15
  ```

  Para recuperar todas as linhas a partir de um certo deslocamento até o final do conjunto de resultados, você pode usar um número grande para o segundo parâmetro. Esta declaração recupera todas as linhas a partir da 96ª linha até a última:

  ```sql
  SELECT * FROM tbl LIMIT 95,18446744073709551615;
  ```

  Com um argumento, o valor especifica o número de linhas a serem retornadas a partir do início do conjunto de resultados:

  ```sql
  SELECT * FROM tbl LIMIT 5;     # Retrieve first 5 rows
  ```

  Em outras palavras, `LIMIT row_count` é equivalente a `LIMIT 0, row_count`.

  Para declarações preparadas, você pode usar marcadores. As seguintes declarações retornam uma linha da tabela `tbl`:

  ```sql
  SET @a=1;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?';
  EXECUTE STMT USING @a;
  ```

  As seguintes declarações retornam a segunda a sexta linha da tabela `tbl`:

  ```sql
  SET @skip=1; SET @numrows=5;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?, ?';
  EXECUTE STMT USING @skip, @numrows;
  ```

  Para compatibilidade com o PostgreSQL, o MySQL também suporta a sintaxe `LIMIT row_count OFFSET offset`.

  Se o `LIMIT` ocorrer dentro de uma expressão de consulta entre parênteses e também for aplicado na consulta externa, os resultados serão indefinidos e podem mudar em uma futura versão do MySQL.

- Uma cláusula `PROCEDURE` nomeia um procedimento que deve processar os dados no conjunto de resultados. Para um exemplo, consulte Seção 8.4.2.4, “Usando PROCEDURE ANALYSE”, que descreve `ANALYSE`, um procedimento que pode ser usado para obter sugestões de tipos de dados de coluna ótimos que podem ajudar a reduzir o tamanho das tabelas.

  Uma cláusula `PROCEDURE` não é permitida em uma declaração `UNION` (union.html).

  Nota

  A sintaxe `PROCEDURE` está desatualizada a partir do MySQL 5.7.18 e foi removida no MySQL 8.0.

- O formulário `SELECT ... INTO` do comando `SELECT` permite que o resultado da consulta seja escrito em um arquivo ou armazenado em variáveis. Para mais informações, consulte Seção 13.2.9.1, "Instrução SELECT ... INTO".

- Se você usar `FOR UPDATE` com um mecanismo de armazenamento que usa bloqueios de página ou de linha, as linhas examinadas pela consulta ficam bloqueadas para escrita até o final da transação atual. O uso de `LOCK IN SHARE MODE` define um bloqueio compartilhado que permite que outras transações leiam as linhas examinadas, mas não as atualizem ou excluam. Veja Seção 14.7.2.4, “Bloqueio de Leitura”.

  Além disso, você não pode usar `FOR UPDATE` como parte da instrução `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. (Se você tentar fazer isso, a declaração é rejeitada com o erro Can't update table '*`old_table`*' while '*`new_table`*' is being created.) Essa é uma mudança no comportamento do MySQL 5.5 e versões anteriores, que permitiam que as instruções `CREATE TABLE ... SELECT` fizessem alterações em tabelas diferentes daquela que estava sendo criada.

Após a palavra-chave `SELECT`, você pode usar vários modificadores que afetam o funcionamento da instrução. `HIGH_PRIORITY`, `STRAIGHT_JOIN` e modificadores que começam com `SQL_` são extensões do MySQL para o SQL padrão.

- Os modificadores `ALL` e `DISTINCT` especificam se as linhas duplicadas devem ser retornadas. `ALL` (o padrão) especifica que todas as linhas que correspondem devem ser retornadas, incluindo as duplicadas. `DISTINCT` especifica a remoção de linhas duplicadas do conjunto de resultados. É um erro especificar ambos os modificadores. `DISTINCTROW` é um sinônimo de `DISTINCT`.

- `HIGH_PRIORITY` dá maior prioridade à consulta `SELECT` do que a uma instrução que atualiza uma tabela. Você deve usar isso apenas para consultas que são muito rápidas e precisam ser executadas de uma vez. Uma consulta `SELECT HIGH_PRIORITY` emitida enquanto a tabela está bloqueada para leitura é executada mesmo que haja uma instrução de atualização esperando pela tabela estar livre. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  `HIGH_PRIORITY` não pode ser usado com instruções `SELECT` que fazem parte de uma `UNION`.

- `STRAIGHT_JOIN` obriga o otimizador a unir as tabelas na ordem em que estão listadas na cláusula `FROM`. Você pode usar isso para acelerar uma consulta se o otimizador unir as tabelas em uma ordem não ótima. `STRAIGHT_JOIN` também pode ser usado na lista *`table_references`*. Veja Seção 13.2.9.2, “Cláusula JOIN”.

  O `STRAIGHT_JOIN` não se aplica a nenhuma tabela que o otimizador trate como uma tabela `[const]` (explicação-output.html#jointype_const) ou `[system]` (explicação-output.html#jointype_system). Uma tabela desse tipo produz uma única linha, é lida durante a fase de otimização da execução da consulta e as referências às suas colunas são substituídas pelos valores apropriados das colunas antes de a execução da consulta prosseguir. Essas tabelas aparecem primeiro no plano da consulta exibido pelo `[EXPLAIN]` (explicação.html). Veja Seção 8.8.1, “Otimizando Consultas com EXPLAIN”. Essa exceção pode não se aplicar a tabelas `[const]` (explicação-output.html#jointype_const) ou `[system]` (explicação-output.html#jointype_system) que são usadas no lado complementado com `NULL` de uma união externa (ou seja, a tabela do lado direito de uma `[LEFT JOIN]` ou a tabela do lado esquerdo de uma `[RIGHT JOIN]`.

- `SQL_BIG_RESULT` ou `SQL_SMALL_RESULT` podem ser usados com `GROUP BY` ou `DISTINCT` para informar o otimizador que o conjunto de resultados tem muitas linhas ou é pequeno, respectivamente. Para `SQL_BIG_RESULT`, o MySQL usa diretamente tabelas temporárias baseadas em disco se elas forem criadas e prefere a ordenação em vez de usar uma tabela temporária com uma chave nos elementos do `GROUP BY`. Para `SQL_SMALL_RESULT`, o MySQL usa tabelas temporárias em memória para armazenar a tabela resultante em vez de usar a ordenação. Isso normalmente não é necessário.

- `SQL_BUFFER_RESULT` obriga o resultado a ser colocado em uma tabela temporária. Isso ajuda o MySQL a liberar os bloqueios da tabela mais cedo e ajuda em casos em que leva muito tempo para enviar o conjunto de resultados ao cliente. Este modificador só pode ser usado para instruções de nível superior de `[SELECT]` (select.html), não para subconsultas ou após `[UNION]` (union.html).

- `SQL_CALC_FOUND_ROWS` instrui o MySQL a calcular quantas linhas haveriam no conjunto de resultados, ignorando qualquer cláusula `LIMIT`. O número de linhas pode então ser recuperado com `SELECT FOUND_ROWS()`. Veja Seção 12.15, “Funções de Informação”.

- Os modificadores `SQL_CACHE` e `SQL_NO_CACHE` afetam o armazenamento de resultados de consultas no cache de consultas (consulte Seção 8.10.3, “O Cache de Consultas MySQL”). `SQL_CACHE` indica ao MySQL que deve armazenar o resultado no cache de consultas se ele for cacheável e o valor da variável de sistema `query_cache_type` for `2` ou `DEMAND`. Com `SQL_NO_CACHE`, o servidor não usa o cache de consultas. Ele não verifica o cache de consultas para ver se o resultado já está armazenado, nem o cacheia o resultado da consulta.

  Esses dois modificadores são mutuamente exclusivos e um erro ocorre se ambos forem especificados. Além disso, esses modificadores não são permitidos em subconsultas (incluindo subconsultas na cláusula `FROM`) e em declarações `SELECT` em uniões que não sejam a primeira `SELECT`.

  Para visualizações, `SQL_NO_CACHE` se aplica se aparecer em qualquer `SELECT` na consulta. Para uma consulta que pode ser cacheada, `SQL_CACHE` se aplica se aparecer no primeiro `SELECT` de uma visualização referenciada pela consulta.

  Nota

  O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A descontinuidade inclui `SQL_CACHE` e `SQL_NO_CACHE`.

Uma consulta `SELECT` de uma tabela particionada usando um mecanismo de armazenamento como `MyISAM` que emprega bloqueios de nível de tabela bloqueia apenas as partições que contêm linhas que correspondem à cláusula `WHERE` da instrução `SELECT`. (Isso não ocorre com mecanismos de armazenamento como `InnoDB` que emprega bloqueios de nível de linha.) Para mais informações, consulte Seção 22.6.4, “Particionamento e Bloqueio”.
