### 13.2.9 Declaração SELECT

[13.2.9.1 Declaração SELECT ... INTO](select-into.html)

[13.2.9.2 Cláusula JOIN](join.html)

[13.2.9.3 Cláusula UNION](union.html)

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
      [PARTITION partition_list
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP
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
        OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
```

A declaração [`SELECT`](select.html "13.2.9 SELECT Statement") é usada para recuperar linhas selecionadas de uma ou mais tabelas, e pode incluir declarações [`UNION`](union.html "13.2.9.3 UNION Clause") e subqueries. Consulte [Seção 13.2.9.3, “Cláusula UNION”](union.html "13.2.9.3 UNION Clause"), e [Seção 13.2.10, “Subqueries”](subqueries.html "13.2.10 Subqueries").

As cláusulas mais comumente usadas da declaração [`SELECT`](select.html "13.2.9 SELECT Statement") são estas:

* Cada *`select_expr`* indica uma coluna que você deseja recuperar. Deve haver pelo menos um *`select_expr`*.

* *`table_references`* indica a tabela ou tabelas das quais recuperar as linhas. Sua sintaxe é descrita na [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause").

* `SELECT` suporta seleção explícita de Partition usando a cláusula `PARTITION` com uma lista de Partitions ou Subpartitions (ou ambos) após o nome da tabela em um *`table_reference`* (consulte [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause")). Neste caso, as linhas são selecionadas apenas das Partitions listadas, e quaisquer outras Partitions da tabela são ignoradas. Para mais informações e exemplos, consulte [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

  `SELECT ... PARTITION` de tabelas que usam Storage Engines como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") que executam Locks de nível de tabela (e, portanto, Locks de Partition) bloqueia apenas as Partitions ou Subpartitions nomeadas pela opção `PARTITION`.

  Para mais informações, consulte [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

* A cláusula `WHERE`, se fornecida, indica a condição ou condições que as linhas devem satisfazer para serem selecionadas. *`where_condition`* é uma expression que avalia como true para cada linha a ser selecionada. A declaração seleciona todas as linhas se não houver cláusula `WHERE`.

  Na expression `WHERE`, você pode usar qualquer uma das Functions e Operators que o MySQL suporta, exceto Functions de agregação (grupo). Consulte [Seção 9.5, “Expressions”](expressions.html "9.5 Expressions"), e [Capítulo 12, *Functions e Operators*](functions.html "Chapter 12 Functions and Operators").

A declaração [`SELECT`](select.html "13.2.9 SELECT Statement") também pode ser usada para recuperar linhas computadas sem referência a nenhuma tabela.

Por exemplo:

```sql
mysql> SELECT 1 + 1;
        -> 2
```

É permitido especificar `DUAL` como um nome de tabela dummy em situações onde nenhuma tabela é referenciada:

```sql
mysql> SELECT 1 + 1 FROM DUAL;
        -> 2
```

`DUAL` existe puramente para a conveniência de pessoas que exigem que todas as declarações [`SELECT`](select.html "13.2.9 SELECT Statement") devam ter a cláusula `FROM` e, possivelmente, outras cláusulas. O MySQL pode ignorar as cláusulas. O MySQL não exige `FROM DUAL` se nenhuma tabela for referenciada.

Em geral, as cláusulas utilizadas devem ser fornecidas exatamente na ordem mostrada na descrição da sintaxe. Por exemplo, uma cláusula `HAVING` deve vir depois de qualquer cláusula `GROUP BY` e antes de qualquer cláusula `ORDER BY`. A cláusula `INTO`, se presente, pode aparecer em qualquer posição indicada pela descrição da sintaxe, mas dentro de uma determinada declaração pode aparecer apenas uma vez, não em múltiplas posições. Para mais informações sobre `INTO`, consulte [Seção 13.2.9.1, “Declaração SELECT ... INTO”](select-into.html "13.2.9.1 SELECT ... INTO Statement").

A lista de termos *`select_expr`* compreende a lista de seleção que indica quais colunas recuperar. Os termos especificam uma coluna ou expression ou podem usar a abreviação `*` (asterisco):

* Uma lista de seleção que consiste apenas em um único `*` não qualificado pode ser usada como abreviação para selecionar todas as colunas de todas as tabelas:

  ```sql
  SELECT * FROM t1 INNER JOIN t2 ...
  ```

* `tbl_name.*` pode ser usada como uma abreviação qualificada para selecionar todas as colunas da tabela nomeada:

  ```sql
  SELECT t1.*, t2.* FROM t1 INNER JOIN t2 ...
  ```

* O uso de um `*` não qualificado com outros itens na lista de seleção pode produzir um erro de parse. Por exemplo:

  ```sql
  SELECT id, * FROM t1
  ```

  Para evitar este problema, use uma referência qualificada `tbl_name.*`:

  ```sql
  SELECT id, t1.* FROM t1
  ```

  Use referências qualificadas `tbl_name.*` para cada tabela na lista de seleção:

  ```sql
  SELECT AVG(score), t1.* FROM t1 ...
  ```

A lista a seguir fornece informações adicionais sobre outras cláusulas `SELECT`:

* Uma *`select_expr`* pode receber um alias usando `AS alias_name`. O alias é usado como o nome da coluna da expression e pode ser usado nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING`. Por exemplo:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) AS full_name
    FROM mytable ORDER BY full_name;
  ```

  O keyword `AS` é opcional ao definir um alias para uma *`select_expr`* com um Identifier. O exemplo anterior poderia ter sido escrito assim:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) full_name
    FROM mytable ORDER BY full_name;
  ```

  No entanto, como o `AS` é opcional, um problema sutil pode ocorrer se você esquecer a vírgula entre duas expressions *`select_expr`*: o MySQL interpreta a segunda como um nome de alias. Por exemplo, na seguinte declaração, `columnb` é tratada como um nome de alias:

  ```sql
  SELECT columna columnb FROM mytable;
  ```

  Por esta razão, é uma boa prática ter o hábito de usar `AS` explicitamente ao especificar aliases de coluna.

  Não é permitido referenciar um alias de coluna em uma cláusula `WHERE`, pois o valor da coluna pode ainda não ter sido determinado quando a cláusula `WHERE` é executada. Consulte [Seção B.3.4.4, “Problemas com Aliases de Coluna”](problems-with-alias.html "B.3.4.4 Problems with Column Aliases").

* A cláusula `FROM table_references` indica a tabela ou tabelas das quais recuperar as linhas. Se você nomear mais de uma tabela, você está realizando um JOIN. Para informações sobre a sintaxe JOIN, consulte [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause"). Para cada tabela especificada, você pode opcionalmente especificar um alias.

  ```sql
  tbl_name AS] alias] [index_hint]
  ```

  O uso de Index Hints (Dicas de Index) fornece ao optimizer informações sobre como escolher Indexes durante o processamento da Query. Para uma descrição da sintaxe para especificar essas dicas, consulte [Seção 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints").

  Você pode usar `SET max_seeks_for_key=value` como uma forma alternativa de forçar o MySQL a preferir Key Scans em vez de Table Scans. Consulte [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

* Você pode referenciar uma tabela dentro do Database padrão como *`tbl_name`*, ou como *`db_name`*.*`tbl_name`* para especificar um Database explicitamente. Você pode referenciar uma coluna como *`col_name`*, *`tbl_name`*.*`col_name`*, ou *`db_name`*.*`tbl_name`*.*`col_name`*. Você não precisa especificar um prefixo *`tbl_name`* ou *`db_name`*.*`tbl_name`* para uma referência de coluna, a menos que a referência seja ambígua. Consulte [Seção 9.2.2, “Qualificadores de Identifier”](identifier-qualifiers.html "9.2.2 Identifier Qualifiers"), para exemplos de ambiguidade que exigem as formas mais explícitas de referência de coluna.

* Uma referência de tabela pode receber um alias usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*. Estas declarações são equivalentes:

  ```sql
  SELECT t1.name, t2.salary FROM employee AS t1, info AS t2
    WHERE t1.name = t2.name;

  SELECT t1.name, t2.salary FROM employee t1, info t2
    WHERE t1.name = t2.name;
  ```

* Colunas selecionadas para output podem ser referenciadas nas cláusulas `ORDER BY` e `GROUP BY` usando nomes de coluna, aliases de coluna ou posições de coluna. As posições de coluna são inteiros e começam com 1:

  ```sql
  SELECT college, region, seed FROM tournament
    ORDER BY region, seed;

  SELECT college, region AS r, seed AS s FROM tournament
    ORDER BY r, s;

  SELECT college, region, seed FROM tournament
    ORDER BY 2, 3;
  ```

  Para ordenar em ordem inversa, adicione o keyword `DESC` (descendente) ao nome da coluna na cláusula `ORDER BY` pela qual você está ordenando. O padrão é ordem ascendente; isto pode ser especificado explicitamente usando o keyword `ASC`.

  Se `ORDER BY` ocorrer dentro de uma Query Expression entre parênteses e também for aplicado na Query externa, os resultados são indefinidos e podem mudar em uma futura versão do MySQL.

  O uso de posições de coluna está deprecated porque a sintaxe foi removida do padrão SQL.

* O MySQL estende a cláusula `GROUP BY` para que você também possa especificar `ASC` e `DESC` após as colunas nomeadas na cláusula. No entanto, esta sintaxe está deprecated. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

* Se você usar `GROUP BY`, as linhas de output são ordenadas de acordo com as colunas `GROUP BY` como se você tivesse um `ORDER BY` para as mesmas colunas. Para evitar o overhead de ordenação que `GROUP BY` produz, adicione `ORDER BY NULL`:

  ```sql
  SELECT a, COUNT(b) FROM test_table GROUP BY a ORDER BY NULL;
  ```

  Confiar na ordenação implícita do `GROUP BY` (ou seja, ordenar na ausência de designadores `ASC` ou `DESC`) ou na ordenação explícita para `GROUP BY` (ou seja, usando designadores `ASC` ou `DESC` explícitos para colunas `GROUP BY`) está deprecated. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

* Quando você usa `ORDER BY` ou `GROUP BY` para ordenar uma coluna em um [`SELECT`](select.html "13.2.9 SELECT Statement"), o servidor ordena os valores usando apenas o número inicial de bytes indicados pela variável de sistema [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length).

* O MySQL estende o uso de `GROUP BY` para permitir a seleção de campos que não são mencionados na cláusula `GROUP BY`. Se você não estiver obtendo os resultados esperados de sua Query, por favor, leia a descrição de `GROUP BY` encontrada na [Seção 12.19, “Funções de Agregação”](aggregate-functions-and-modifiers.html "12.19 Aggregate Functions").

* `GROUP BY` permite um modificador `WITH ROLLUP`. Consulte [Seção 12.19.2, “Modificadores GROUP BY”](group-by-modifiers.html "12.19.2 GROUP BY Modifiers").

* A cláusula `HAVING`, assim como a cláusula `WHERE`, especifica condições de seleção. A cláusula `WHERE` especifica condições nas colunas na lista de seleção, mas não pode referenciar Funções de Agregação. A cláusula `HAVING` especifica condições em grupos, tipicamente formados pela cláusula `GROUP BY`. O resultado da Query inclui apenas grupos que satisfazem as condições `HAVING`. (Se nenhum `GROUP BY` estiver presente, todas as linhas implicitamente formam um único grupo de agregação.)

  A cláusula `HAVING` é aplicada quase por último, logo antes que os itens sejam enviados ao cliente, sem otimização. (`LIMIT` é aplicado após `HAVING`.)

  O padrão SQL exige que `HAVING` referencie apenas colunas na cláusula `GROUP BY` ou colunas usadas em Funções de Agregação. No entanto, o MySQL suporta uma extensão a este comportamento, e permite que `HAVING` referencie colunas na lista [`SELECT`](select.html "13.2.9 SELECT Statement") e colunas em Subqueries externas também.

  Se a cláusula `HAVING` referenciar uma coluna ambígua, ocorre um warning. Na declaração a seguir, `col2` é ambígua porque é usada tanto como um alias quanto como um nome de coluna:

  ```sql
  SELECT COUNT(col1) AS col2 FROM t GROUP BY col2 HAVING col2 = 2;
  ```

  A preferência é dada ao comportamento padrão SQL, então se um nome de coluna `HAVING` for usado tanto em `GROUP BY` quanto como uma coluna com alias na lista de colunas de seleção, a preferência é dada à coluna na cláusula `GROUP BY`.

* Não use `HAVING` para itens que deveriam estar na cláusula `WHERE`. Por exemplo, não escreva o seguinte:

  ```sql
  SELECT col_name FROM tbl_name HAVING col_name > 0;
  ```

  Escreva isto em vez disso:

  ```sql
  SELECT col_name FROM tbl_name WHERE col_name > 0;
  ```

* A cláusula `HAVING` pode referenciar Funções de Agregação, o que a cláusula `WHERE` não pode:

  ```sql
  SELECT user, MAX(salary) FROM users
    GROUP BY user HAVING MAX(salary) > 10;
  ```

  (Isso não funcionava em algumas versões mais antigas do MySQL.)

* O MySQL permite nomes de coluna duplicados. Ou seja, pode haver mais de um *`select_expr`* com o mesmo nome. Esta é uma extensão ao padrão SQL. Como o MySQL também permite que `GROUP BY` e `HAVING` referenciem valores *`select_expr`*, isso pode resultar em uma ambiguidade:

  ```sql
  SELECT 12 AS a, a FROM t GROUP BY a;
  ```

  Nessa declaração, ambas as colunas têm o nome `a`. Para garantir que a coluna correta seja usada para agrupamento, use nomes diferentes para cada *`select_expr`*.

* O MySQL resolve referências não qualificadas de coluna ou alias em cláusulas `ORDER BY` pesquisando nos valores *`select_expr`*, e depois nas colunas das tabelas na cláusula `FROM`. Para cláusulas `GROUP BY` ou `HAVING`, ele pesquisa a cláusula `FROM` antes de pesquisar nos valores *`select_expr`*. (Para `GROUP BY` e `HAVING`, isso difere do comportamento pré-MySQL 5.0 que usava as mesmas regras que para `ORDER BY`.)

* A cláusula `LIMIT` pode ser usada para restringir o número de linhas retornadas pela declaração [`SELECT`](select.html "13.2.9 SELECT Statement"). `LIMIT` aceita um ou dois argumentos numéricos, os quais devem ser constantes inteiras não negativas, com estas exceções:

  + Dentro de Prepared Statements, os parâmetros `LIMIT` podem ser especificados usando marcadores de placeholder `?`.

  + Dentro de stored programs, os parâmetros `LIMIT` podem ser especificados usando parâmetros de rotina ou variáveis locais com valor inteiro.

  Com dois argumentos, o primeiro argumento especifica o Offset da primeira linha a retornar, e o segundo especifica o número máximo de linhas a retornar. O Offset da linha inicial é 0 (não 1):

  ```sql
  SELECT * FROM tbl LIMIT 5,10;  # Retrieve rows 6-15
  ```

  Para recuperar todas as linhas a partir de um certo Offset até o final do Result Set, você pode usar um número grande para o segundo parâmetro. Esta declaração recupera todas as linhas da 96ª linha até a última:

  ```sql
  SELECT * FROM tbl LIMIT 95,18446744073709551615;
  ```

  Com um argumento, o valor especifica o número de linhas a retornar a partir do início do Result Set:

  ```sql
  SELECT * FROM tbl LIMIT 5;     # Retrieve first 5 rows
  ```

  Em outras palavras, `LIMIT row_count` é equivalente a `LIMIT 0, row_count`.

  Para Prepared Statements, você pode usar placeholders. As seguintes declarações retornam uma linha da tabela `tbl`:

  ```sql
  SET @a=1;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?';
  EXECUTE STMT USING @a;
  ```

  As seguintes declarações retornam da segunda à sexta linha da tabela `tbl`:

  ```sql
  SET @skip=1; SET @numrows=5;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?, ?';
  EXECUTE STMT USING @skip, @numrows;
  ```

  Para compatibilidade com PostgreSQL, o MySQL também suporta a sintaxe `LIMIT row_count OFFSET offset`.

  Se `LIMIT` ocorrer dentro de uma Query Expression entre parênteses e também for aplicado na Query externa, os resultados são indefinidos e podem mudar em uma futura versão do MySQL.

* Uma cláusula `PROCEDURE` nomeia uma procedure que deve processar os dados no Result Set. Para um exemplo, consulte [Seção 8.4.2.4, “Usando PROCEDURE ANALYSE”](procedure-analyse.html "8.4.2.4 Using PROCEDURE ANALYSE"), que descreve `ANALYSE`, uma procedure que pode ser usada para obter sugestões para tipos de dados de coluna ideais que podem ajudar a reduzir o tamanho das tabelas.

  Uma cláusula `PROCEDURE` não é permitida em uma declaração [`UNION`](union.html "13.2.9.3 UNION Clause").

  Note

  A sintaxe `PROCEDURE` está deprecated a partir do MySQL 5.7.18, e foi removida no MySQL 8.0.

* A forma [`SELECT ... INTO`](select-into.html "13.2.9.1 SELECT ... INTO Statement") de [`SELECT`](select.html "13.2.9.1 SELECT ... INTO Statement") permite que o resultado da Query seja escrito em um arquivo ou armazenado em variáveis. Para mais informações, consulte [Seção 13.2.9.1, “Declaração SELECT ... INTO”](select-into.html "13.2.9.1 SELECT ... INTO Statement").

* Se você usar `FOR UPDATE` com um Storage Engine que utiliza Page ou Row Locks, as linhas examinadas pela Query são write-locked até o final da transação atual. Usar `LOCK IN SHARE MODE` define um Shared Lock que permite que outras transações leiam as linhas examinadas, mas não as atualizem ou excluam. Consulte [Seção 14.7.2.4, “Locking Reads”](innodb-locking-reads.html "14.7.2.4 Locking Reads").

  Além disso, você não pode usar `FOR UPDATE` como parte do [`SELECT`](select.html "13.2.9 SELECT Statement") em uma declaração como [`CREATE TABLE new_table SELECT ... FROM old_table ...`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"). (Se você tentar fazê-lo, a declaração é rejeitada com o erro Não é possível atualizar a tabela '*`old_table`*' enquanto '*`new_table`*' está sendo criada.) Esta é uma mudança de comportamento em relação ao MySQL 5.5 e anteriores, que permitiam que as declarações [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") fizessem alterações em tabelas diferentes da tabela que estava sendo criada.

Após o keyword [`SELECT`](select.html "13.2.9 SELECT Statement"), você pode usar uma série de Modifiers que afetam a operação da declaração. `HIGH_PRIORITY`, `STRAIGHT_JOIN` e modificadores que começam com `SQL_` são extensões do MySQL ao padrão SQL.

* Os Modifiers `ALL` e `DISTINCT` especificam se linhas duplicadas devem ser retornadas. `ALL` (o padrão) especifica que todas as linhas correspondentes devem ser retornadas, incluindo duplicatas. `DISTINCT` especifica a remoção de linhas duplicadas do Result Set. É um erro especificar ambos os Modifiers. `DISTINCTROW` é um sinônimo de `DISTINCT`.

* `HIGH_PRIORITY` dá ao [`SELECT`](select.html "13.2.9 SELECT Statement") prioridade maior do que uma declaração que atualiza uma tabela. Você deve usar isso apenas para Queries muito rápidas e que devem ser executadas imediatamente. Uma Query `SELECT HIGH_PRIORITY` emitida enquanto a tabela está Locked para leitura é executada mesmo que haja uma declaração de Update esperando que a tabela seja liberada. Isso afeta apenas Storage Engines que usam apenas Locking de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  `HIGH_PRIORITY` não pode ser usado com declarações [`SELECT`](select.html "13.2.9 SELECT Statement") que fazem parte de uma [`UNION`](union.html "13.2.9.3 UNION Clause").

* `STRAIGHT_JOIN` força o optimizer a unir (JOIN) as tabelas na ordem em que estão listadas na cláusula `FROM`. Você pode usar isso para acelerar uma Query se o optimizer estiver unindo as tabelas em uma ordem não ideal. `STRAIGHT_JOIN` também pode ser usado na lista *`table_references`*. Consulte [Seção 13.2.9.2, “Cláusula JOIN”](join.html "13.2.9.2 JOIN Clause").

  `STRAIGHT_JOIN` não se aplica a nenhuma tabela que o optimizer trate como uma tabela [`const`](explain-output.html#jointype_const) ou [`system`](explain-output.html#jointype_system). Uma tabela desse tipo produz uma única linha, é lida durante a fase de otimização da execução da Query e as referências às suas colunas são substituídas pelos valores de coluna apropriados antes que a execução da Query prossiga. Essas tabelas aparecem primeiro no Query Plan exibido por [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). Consulte [Seção 8.8.1, “Otimizando Queries com EXPLAIN”](using-explain.html "8.8.1 Optimizing Queries with EXPLAIN"). Esta exceção pode não se aplicar a tabelas [`const`](explain-output.html#jointype_const) ou [`system`](explain-output.html#jointype_system) que são usadas no lado complementado por `NULL` de um Outer Join (ou seja, a tabela do lado direito de um `LEFT JOIN` ou a tabela do lado esquerdo de um `RIGHT JOIN`).

* `SQL_BIG_RESULT` ou `SQL_SMALL_RESULT` podem ser usados com `GROUP BY` ou `DISTINCT` para informar ao optimizer que o Result Set tem muitas linhas ou é pequeno, respectivamente. Para `SQL_BIG_RESULT`, o MySQL usa diretamente Temporary Tables baseadas em disco, se forem criadas, e prefere ordenação em vez de usar uma Temporary Table com uma Key nos elementos `GROUP BY`. Para `SQL_SMALL_RESULT`, o MySQL usa Temporary Tables in-memory para armazenar a tabela resultante em vez de usar ordenação. Isso normalmente não deveria ser necessário.

* `SQL_BUFFER_RESULT` força o resultado a ser colocado em uma Temporary Table. Isso ajuda o MySQL a liberar os Table Locks mais cedo e é útil em casos em que leva muito tempo para enviar o Result Set ao cliente. Este Modifier pode ser usado apenas para declarações [`SELECT`](select.html "13.2.9 SELECT Statement") de nível superior, não para Subqueries ou após uma [`UNION`](union.html "13.2.9.3 UNION Clause").

* `SQL_CALC_FOUND_ROWS` instrui o MySQL a calcular quantas linhas haveria no Result Set, desconsiderando qualquer cláusula `LIMIT`. O número de linhas pode então ser recuperado com `SELECT FOUND_ROWS()`. Consulte [Seção 12.15, “Funções de Informação”](information-functions.html "12.15 Information Functions").

* Os Modifiers `SQL_CACHE` e `SQL_NO_CACHE` afetam o caching dos resultados da Query no Query Cache (consulte [Seção 8.10.3, “O Query Cache do MySQL”](query-cache.html "8.10.3 The MySQL Query Cache")). `SQL_CACHE` instrui o MySQL a armazenar o resultado no Query Cache se for cacheável e o valor da variável de sistema [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type) for `2` ou `DEMAND`. Com `SQL_NO_CACHE`, o servidor não usa o Query Cache. Ele nem verifica o Query Cache para ver se o resultado já está armazenado, nem armazena em cache o resultado da Query.

  Esses dois Modifiers são mutuamente exclusivos e um erro ocorre se ambos forem especificados. Além disso, esses Modifiers não são permitidos em Subqueries (incluindo Subqueries na cláusula `FROM`), e em declarações [`SELECT`](select.html "13.2.9 SELECT Statement") em Unions que não sejam o primeiro [`SELECT`](select.html "13.2.9 SELECT Statement").

  Para Views, `SQL_NO_CACHE` se aplica se aparecer em qualquer [`SELECT`](select.html "13.2.9 SELECT Statement") na Query. Para uma Query cacheável, `SQL_CACHE` se aplica se aparecer no primeiro [`SELECT`](select.html "13.2.9 SELECT Statement") de uma View referenciada pela Query.

  Note

  O Query Cache está deprecated a partir do MySQL 5.7.20 e foi removido no MySQL 8.0. A depreciação inclui `SQL_CACHE` e `SQL_NO_CACHE`.

Uma declaração `SELECT` de uma tabela partitioned que usa um Storage Engine como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), que emprega Locks de nível de tabela, bloqueia apenas as Partitions que contêm linhas que correspondem à cláusula `WHERE` da declaração `SELECT`. (Isso não ocorre com Storage Engines como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") que empregam Row-Level Locking.) Para mais informações, consulte [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").