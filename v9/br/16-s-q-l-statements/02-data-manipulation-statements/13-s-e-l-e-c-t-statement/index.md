### 15.2.13 Instrução `SELECT`

15.2.13.1 Instrução `SELECT ... INTO`

15.2.13.2 Cláusula `JOIN`

```
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY]
    [STRAIGHT_JOIN]
    [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr] ...
    [into_option]
    [FROM table_references
      [PARTITION partition_list]]
    [WHERE where_condition]
    [GROUP BY [ {col_name | expr | position}, ... [WITH ROLLUP]
              | ROLLUP ({col_name | expr | position}, ...)] ]
    [HAVING where_condition]
    [WINDOW window_name AS (window_spec)
        [, window_name AS (window_spec)] ...]
    [ORDER BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP]]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [into_option]
    [FOR {UPDATE | SHARE}
        [OF tbl_name [, tbl_name] ...]
        [NOWAIT | SKIP LOCKED]
      | LOCK IN SHARE MODE]
    [into_option]

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

A instrução `SELECT` é usada para recuperar linhas selecionadas de uma ou mais tabelas e pode incluir operações `UNION` e subconsultas. As operações `INTERSECT` e `EXCEPT` também são suportadas. Os operadores `UNION`, `INTERSECT` e `EXCEPT` são descritos com mais detalhes mais adiante nesta seção. Veja também a Seção 15.2.15, “Subconsultas”.

A instrução `SELECT` pode começar com uma cláusula `WITH`) para definir expressões de tabela comuns acessíveis dentro do `SELECT`. Veja a Seção 15.2.20, “WITH (Expressões de Tabela Comuns”)”).

As cláusulas mais comumente usadas das instruções `SELECT` são estas:

* Cada *`select_expr`* indica uma coluna que você deseja recuperar. Deve haver pelo menos um *`select_expr`*.

* *`table_references`* indica a(s) tabela(s) a partir da(s) qual(is) as linhas serão recuperadas. Sua sintaxe é descrita na Seção 15.2.13.2, “Cláusula `JOIN`”.

* `SELECT` suporta seleção explícita de partições usando a cláusula `PARTITION` com uma lista de partições ou subpartições (ou ambas) após o nome da tabela em uma *`table_reference`* (veja a Seção 15.2.13.2, “Cláusula `JOIN`”). Nesse caso, as linhas são selecionadas apenas das partições listadas, e quaisquer outras partições da tabela são ignoradas. Para mais informações e exemplos, veja a Seção 26.5, “Seleção de Partições”.

* A cláusula `WHERE`, se fornecida, indica a condição ou condições que as linhas devem satisfazer para serem selecionadas. *`where_condition`* é uma expressão que avalia como verdadeira para cada linha a ser selecionada. A instrução seleciona todas as linhas se não houver cláusula `WHERE`.

Na expressão `WHERE`, você pode usar qualquer uma das funções e operadores suportados pelo MySQL, exceto as funções agregadas (de grupo). Veja a Seção 11.5, “Expressões”, e o Capítulo 14, *Funções e Operadores*.

O `SELECT` também pode ser usado para recuperar linhas calculadas sem referência a nenhuma tabela.

Por exemplo:

```
mysql> SELECT 1 + 1;
        -> 2
```

Você pode especificar `DUAL` como um nome de tabela fictício em situações em que nenhuma tabela é referenciada:

```
mysql> SELECT 1 + 1 FROM DUAL;
        -> 2
```

`DUAL` é puramente para a conveniência das pessoas que exigem que todas as declarações `SELECT` tenham `FROM` e possivelmente outras cláusulas. O MySQL pode ignorar as cláusulas. O MySQL não requer `FROM DUAL` se nenhuma tabela for referenciada.

Em geral, as cláusulas usadas devem ser dadas exatamente na ordem mostrada na descrição da sintaxe. Por exemplo, uma cláusula `HAVING` deve vir após qualquer cláusula `GROUP BY` e antes de qualquer cláusula `ORDER BY`. A cláusula `INTO`, se presente, pode aparecer em qualquer posição indicada pela descrição da sintaxe, mas dentro de uma declaração dada pode aparecer apenas uma vez, não em múltiplas posições. Para mais informações sobre `INTO`, veja a Seção 15.2.13.1, “Declaração SELECT ... INTO”.

A lista de termos de *`select_expr`* compreende a lista de seleção que indica quais colunas devem ser recuperadas. Os termos especificam uma coluna ou expressão ou podem usar a abreviação `*`:

* Uma lista de seleção composta apenas por um único `*` não qualificada pode ser usada como abreviação para selecionar todas as colunas de todas as tabelas:

  ```
  SELECT * FROM t1 INNER JOIN t2 ...
  ```

* `tbl_name.*` pode ser usado como uma abreviação qualificada para selecionar todas as colunas da tabela nomeada:

  ```
  SELECT t1.*, t2.* FROM t1 INNER JOIN t2 ...
  ```

* Se uma tabela tiver colunas invisíveis, `*` e `tbl_name.*` não as incluem. Para serem incluídas, as colunas invisíveis devem ser referenciadas explicitamente.

* O uso de um asterisco não qualificado (*), junto com outros itens na lista de seleção, pode gerar um erro de análise. Por exemplo:

  ```
  SELECT id, * FROM t1
  ```

  Para evitar esse problema, use uma referência qualificada `tbl_name.*`:

  ```
  SELECT id, t1.* FROM t1
  ```

  Use referências qualificadas `tbl_name.*` para cada tabela na lista de seleção:

  ```
  SELECT AVG(score), t1.* FROM t1 ...
  ```

A lista a seguir fornece informações adicionais sobre outras cláusulas `SELECT`:

* Uma *`select_expr`* pode ser atribuído um alias usando `AS alias_name`. O alias é usado como o nome da coluna da expressão e pode ser usado nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING`. Por exemplo:

  ```
  SELECT CONCAT(last_name,', ',first_name) AS full_name
    FROM mytable ORDER BY full_name;
  ```

  A palavra-chave `AS` é opcional ao atribuir um *`select_expr`* a um identificador. O exemplo anterior poderia ter sido escrito assim:

  ```
  SELECT CONCAT(last_name,', ',first_name) full_name
    FROM mytable ORDER BY full_name;
  ```

  No entanto, como a palavra-chave `AS` é opcional, pode ocorrer um problema sutil se você esquecer a vírgula entre duas expressões de *`select_expr`*: o MySQL interpreta a segunda como um nome de alias. Por exemplo, na seguinte declaração, `columnb` é tratado como um nome de alias:

  ```
  SELECT columna columnb FROM mytable;
  ```

  Por essa razão, é uma boa prática ter o hábito de usar `AS` explicitamente ao especificar aliases de colunas.

  Não é permitido referenciar um alias de coluna em uma cláusula `WHERE`, porque o valor da coluna ainda pode não estar determinado quando a cláusula `WHERE` é executada. Veja a Seção B.3.4.4, “Problemas com Alisados de Colunas”.

* A cláusula `FROM table_references` indica a(s) tabela(s) a partir da(s) qual(is) as linhas serão recuperadas. Se você nomear mais de uma tabela, está realizando uma junção. Para informações sobre a sintaxe de junção, consulte a Seção 15.2.13.2, “Cláusula JOIN”. Para cada tabela especificada, você pode opcionalmente especificar um alias.

  ```
  tbl_name [[AS] alias] [index_hint]
  ```

O uso de dicas de índice fornece ao otimizador informações sobre como escolher índices durante o processamento de consultas. Para uma descrição da sintaxe para especificar essas dicas, consulte a Seção 10.9.4, “Dicas de Índice”.

Você pode usar `SET max_seeks_for_key=valor` como uma maneira alternativa de forçar o MySQL a preferir varreduras de chave em vez de varreduras de tabela. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* Você pode referenciar uma tabela dentro do banco de dados padrão como *`tbl_name`*, ou como *`db_name`*.*`tbl_name`* para especificar um banco de dados explicitamente. Você pode referenciar uma coluna como *`col_name`*, *`tbl_name`*.*`col_name`*, ou *`db_name`*.*`tbl_name`*.*`col_name`*. Você não precisa especificar um *`tbl_name`* ou *`db_name`*.*`tbl_name`* prefixo para uma referência de coluna, a menos que a referência seja ambígua. Veja a Seção 11.2.2, “Qualificadores de Identificador”, para exemplos de ambiguidade que requerem as formas de referência de coluna mais explícitas.

* Uma referência de tabela pode ser aliassificada usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*. Essas declarações são equivalentes:

  ```
  SELECT t1.name, t2.salary FROM employee AS t1, info AS t2
    WHERE t1.name = t2.name;

  SELECT t1.name, t2.salary FROM employee t1, info t2
    WHERE t1.name = t2.name;
  ```

* Colunas selecionadas para saída podem ser referenciadas nas cláusulas `ORDER BY` e `GROUP BY` usando nomes de colunas, aliases de colunas ou posições de coluna. As posições de coluna são inteiros e começam com 1:

  ```
  SELECT college, region, seed FROM tournament
    ORDER BY region, seed;

  SELECT college, region AS r, seed AS s FROM tournament
    ORDER BY r, s;

  SELECT college, region, seed FROM tournament
    ORDER BY 2, 3;
  ```

  Para ordenar em ordem inversa, adicione a palavra-chave `DESC` (descendente) ao nome da coluna na cláusula `ORDER BY` pela qual você está ordenando. O padrão é ordem ascendente; isso pode ser especificado explicitamente usando a palavra-chave `ASC`.

  Se `ORDER BY` ocorre dentro de uma expressão de consulta entre parênteses e também é aplicada na consulta externa, os resultados são indefinidos e podem mudar em uma versão futura do MySQL.

  O uso de posições de coluna é desaconselhado porque a sintaxe foi removida do padrão SQL.

* Quando você usa `ORDER BY` ou `GROUP BY` para ordenar uma coluna em um `SELECT`, o servidor ordena os valores usando apenas o número inicial de bytes indicado pela variável de sistema `max_sort_length`.

* O MySQL estende o uso de `GROUP BY` para permitir a seleção de campos que não são mencionados na cláusula `GROUP BY`. Se você não está obtendo os resultados que espera de sua consulta, por favor, leia a descrição de `GROUP BY` encontrada na Seção 14.19, “Funções Agregadas”.

* A cláusula `HAVING`, assim como a cláusula `WHERE`, especifica condições de seleção. A cláusula `WHERE` especifica condições em colunas na lista de seleção, mas não pode referenciar funções agregadas. A cláusula `HAVING` especifica condições em grupos, tipicamente formados pela cláusula `GROUP BY`. O resultado da consulta inclui apenas os grupos que satisfazem as condições de `HAVING`. (Se não houver `GROUP BY`, todas as linhas implicitamente formam um único grupo agregado.)

  A cláusula `HAVING` é aplicada quase no final, logo antes que os itens sejam enviados ao cliente, sem otimização. (`LIMIT` é aplicado após `HAVING`.])

  O padrão SQL exige que `HAVING` deve referenciar apenas colunas na cláusula `GROUP BY` ou colunas usadas em funções agregadas. No entanto, o MySQL suporta uma extensão a esse comportamento e permite que `HAVING` se refira a colunas na lista `SELECT` e a colunas em subconsultas externas também.

  Se a cláusula `HAVING` se referir a uma coluna ambígua, ocorre um aviso. Na seguinte declaração, `col2` é ambígua porque é usado tanto como um alias quanto como um nome de coluna:

  ```
  SELECT COUNT(col1) AS col2 FROM t GROUP BY col2 HAVING col2 = 2;
  ```

  A preferência é dada ao comportamento padrão do SQL, então, se um nome de coluna `HAVING` for usado tanto em `GROUP BY` quanto como uma coluna aliasing na lista de colunas de seleção, a preferência é dada à coluna na coluna `GROUP BY`.

* Não use `HAVING` para itens que devem estar na cláusula `WHERE`. Por exemplo, não escreva o seguinte:

  ```
  SELECT col_name FROM tbl_name HAVING col_name > 0;
  ```

  Escreva isso em vez disso:

  ```
  SELECT col_name FROM tbl_name WHERE col_name > 0;
  ```

* A cláusula `HAVING` pode se referir a funções agregadas, que a cláusula `WHERE` não pode:

  ```
  SELECT user, MAX(salary) FROM users
    GROUP BY user HAVING MAX(salary) > 10;
  ```

  (Isso não funcionou em algumas versões mais antigas do MySQL.)

* O MySQL permite nomes de colunas duplicados. Ou seja, pode haver mais de um *`select_expr`* com o mesmo nome. Isso é uma extensão do SQL padrão. Como o MySQL também permite que `GROUP BY` e `HAVING` se refiram a valores de *`select_expr`*, isso pode resultar em ambiguidade:

  ```
  SELECT 12 AS a, a FROM t GROUP BY a;
  ```

  Naquela declaração, ambas as colunas têm o nome `a`. Para garantir que a coluna correta seja usada para o agrupamento, use nomes diferentes para cada *`select_expr`*.

* A cláusula `WINDOW`, se presente, define janelas nomeadas que podem ser referenciadas por funções de janela. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.

* O MySQL resolve referências não qualificadas de colunas ou aliases nas cláusulas `ORDER BY` procurando nos valores de *`select_expr`*, depois nas colunas das tabelas na cláusula `FROM`. Para cláusulas `GROUP BY` ou `HAVING`, ele procura na cláusula `FROM` antes de procurar nos valores de *`select_expr`*. (Para `GROUP BY` e `HAVING`, isso difere do comportamento anterior ao MySQL 5.0, que usava as mesmas regras que para `ORDER BY`.)

* A cláusula `LIMIT` pode ser usada para restringir o número de linhas retornadas pela instrução `SELECT`. `LIMIT` aceita um ou dois argumentos numéricos, que devem ser ambos constantes inteiras não negativas, com essas exceções:

  + Dentro de instruções preparadas, os parâmetros `LIMIT` podem ser especificados usando marcadores de substituição `?`.

  + Dentro de programas armazenados, os parâmetros `LIMIT` podem ser especificados usando parâmetros de rotina com valor inteiro ou variáveis locais.

Com dois argumentos, o primeiro especifica o deslocamento da primeira linha a ser retornada e o segundo especifica o número máximo de linhas a ser retornado. O deslocamento da primeira linha inicial é 0 (não 1):

```
  SELECT * FROM tbl LIMIT 5,10;  # Retrieve rows 6-15
  ```

Para recuperar todas as linhas a partir de um certo deslocamento até o final do conjunto de resultados, você pode usar um número grande para o segundo parâmetro. Esta declaração recupera todas as linhas a partir da 96ª linha até a última:

```
  SELECT * FROM tbl LIMIT 95,18446744073709551615;
  ```

Com um argumento, o valor especifica o número de linhas a ser retornado a partir do início do conjunto de resultados:

```
  SELECT * FROM tbl LIMIT 5;     # Retrieve first 5 rows
  ```

Em outras palavras, `LIMIT row_count` é equivalente a `LIMIT 0, row_count`.

Para instruções preparadas, você pode usar marcadores. As seguintes instruções retornam uma linha da tabela `tbl`:

```
  SET @a=1;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?';
  EXECUTE STMT USING @a;
  ```

As seguintes instruções retornam as segunda a sexta linhas da tabela `tbl`:

```
  SET @skip=1; SET @numrows=5;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?, ?';
  EXECUTE STMT USING @skip, @numrows;
  ```

Para compatibilidade com o PostgreSQL, o MySQL também suporta a sintaxe `LIMIT row_count OFFSET offset`.

Se `LIMIT` ocorre dentro de uma expressão de consulta entre parênteses e também é aplicada na consulta externa, os resultados são indefinidos e podem mudar em uma versão futura do MySQL.

* A forma `SELECT ... INTO` do `SELECT` permite que o resultado da consulta seja escrito em um arquivo ou armazenado em variáveis. Para mais informações, consulte a Seção 15.2.13.1, “Instrução SELECT ... INTO”.

* Se você usar `FOR UPDATE` com um mecanismo de armazenamento que usa bloqueios de página ou de linha, as linhas examinadas pela consulta são bloqueadas para escrita até o final da transação atual.

Você não pode usar `FOR UPDATE` como parte da consulta `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. (Se você tentar fazer isso, a declaração é rejeitada com o erro Can't update table '*`old_table`*' while '*`new_table`*' is being created.)

`FOR SHARE` e `LOCK IN SHARE MODE` definem bloqueios compartilhados que permitem que outras transações leiam as linhas examinadas, mas não as atualizem ou excluam. `FOR SHARE` e `LOCK IN SHARE MODE` são equivalentes. No entanto, `FOR SHARE`, como `FOR UPDATE`, suporta as opções `NOWAIT`, `SKIP LOCKED` e `OF tbl_name`. `FOR SHARE` é um substituto de `LOCK IN SHARE MODE`, mas `LOCK IN SHARE MODE` permanece disponível para compatibilidade com versões anteriores.

`NOWAIT` faz com que uma consulta `FOR UPDATE` ou `FOR SHARE` seja executada imediatamente, retornando um erro se um bloqueio de linha não puder ser obtido devido a um bloqueio mantido por outra transação.

`SKIP LOCKED` faz com que uma consulta `FOR UPDATE` ou `FOR SHARE` seja executada imediatamente, excluindo as linhas do conjunto de resultados que estão bloqueadas por outra transação.

As opções `NOWAIT` e `SKIP LOCKED` são inseguras para a replicação baseada em declarações.

Nota

Consultas que ignoram linhas bloqueadas retornam uma visão inconsistente dos dados. `SKIP LOCKED` não é, portanto, adequado para trabalhos transacionais gerais. No entanto, pode ser usado para evitar a disputa por bloqueios quando múltiplas sessões acessam a mesma tabela semelhante a uma fila.

`OF tbl_name` aplica consultas `FOR UPDATE` e `FOR SHARE` a tabelas nomeadas. Por exemplo:

```
  SELECT * FROM t1, t2 FOR SHARE OF t1 FOR UPDATE OF t2;
  ```

Todas as tabelas referenciadas pelo bloco de consulta são bloqueadas quando `OF tbl_name` é omitido. Consequentemente, usar uma cláusula de bloqueio sem `OF tbl_name` em combinação com outra cláusula de bloqueio retorna um erro. Especificar a mesma tabela em múltiplas cláusulas de bloqueio retorna um erro. Se um alias for especificado como o nome da tabela na declaração `SELECT`, uma cláusula de bloqueio pode usar apenas o alias. Se a declaração `SELECT` não especificar explicitamente um alias, a cláusula de bloqueio pode especificar apenas o nome real da tabela.

Para obter mais informações sobre `FOR UPDATE` e `FOR SHARE`, consulte a Seção 17.7.2.4, “Bloqueio de Leitura”. Para informações adicionais sobre as opções `NOWAIT` e `SKIP LOCKED`, consulte Bloqueio de Concorrência de Leitura com NOWAIT e SKIP LOCKED.

Após a palavra-chave `SELECT`, você pode usar vários modificadores que afetam o funcionamento da instrução. `HIGH_PRIORITY`, `STRAIGHT_JOIN` e modificadores que começam com `SQL_` são extensões do MySQL para o SQL padrão.

* Os modificadores `ALL` e `DISTINCT` especificam se as linhas duplicadas devem ser retornadas. `ALL` (o padrão) especifica que todas as linhas que correspondem devem ser retornadas, incluindo as duplicadas. `DISTINCT` especifica a remoção de linhas duplicadas do conjunto de resultados. É um erro especificar ambos os modificadores. `DISTINCTROW` é um sinônimo de `DISTINCT`.

  `DISTINCT` pode ser usado com uma consulta que também usa `WITH ROLLUP`.

* `HIGH_PRIORITY` dá maior prioridade à `SELECT` do que a uma instrução que atualiza uma tabela. Você deve usar isso apenas para consultas que são muito rápidas e devem ser executadas de uma vez. Uma consulta `SELECT HIGH_PRIORITY` que é emitida enquanto a tabela está bloqueada para leitura é executada mesmo que haja uma instrução de atualização esperando a tabela ficar livre. Isso afeta apenas os motores de armazenamento que usam apenas o bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

  `HIGH_PRIORITY` não pode ser usado com instruções `SELECT` que fazem parte de uma `UNION`.

* `STRAIGHT_JOIN` força o otimizador a unir as tabelas na ordem em que estão listadas na cláusula `FROM`. Você pode usar isso para acelerar uma consulta se o otimizador unir as tabelas em uma ordem não ótima. `STRAIGHT_JOIN` também pode ser usado na lista `table_references`. Consulte a Seção 15.2.13.2, “Cláusula JOIN”.

`STRAIGHT_JOIN` não se aplica a nenhuma tabela que o otimizador trate como uma tabela `const` ou `system`. Uma tabela desse tipo produz uma única linha, é lida durante a fase de otimização da execução da consulta e as referências às suas colunas são substituídas pelos valores apropriados das colunas antes de a execução da consulta prosseguir. Essas tabelas aparecem primeiro no plano da consulta exibido pelo `EXPLAIN`. Veja a Seção 10.8.1, “Otimizando Consultas com EXPLAIN”. Essa exceção pode não se aplicar a tabelas `const` ou `system` que são usadas no lado complementado com `NULL` de uma união externa (ou seja, a tabela do lado direito de uma `LEFT JOIN` ou a tabela do lado esquerdo de uma `RIGHT JOIN`.

* `SQL_BIG_RESULT` ou `SQL_SMALL_RESULT` podem ser usados com `GROUP BY` ou `DISTINCT` para informar ao otimizador que o conjunto de resultados tem muitas linhas ou é pequeno, respectivamente. Para `SQL_BIG_RESULT`, o MySQL usa diretamente tabelas temporárias baseadas em disco se elas forem criadas e prefere a ordenação em vez de usar uma tabela temporária com uma chave nos elementos do `GROUP BY`. Para `SQL_SMALL_RESULT`, o MySQL usa tabelas temporárias em memória para armazenar a tabela resultante em vez de usar a ordenação. Isso normalmente não é necessário.

* `SQL_BUFFER_RESULT` força o resultado a ser colocado em uma tabela temporária. Isso ajuda o MySQL a liberar as blocações da tabela mais cedo e ajuda em casos em que leva muito tempo para enviar o conjunto de resultados ao cliente. Esse modificador pode ser usado apenas para instruções `SELECT` de nível superior, não para subconsultas ou após `UNION`.

* `SQL_CALC_FOUND_ROWS` informa ao MySQL para calcular quantas linhas haveriam no conjunto de resultados, ignorando qualquer cláusula `LIMIT`. O número de linhas pode então ser recuperado com `SELECT FOUND_ROWS()`. Veja a Seção 14.15, “Funções de Informações”.

Nota

O modificador de consulta `SQL_CALC_FOUND_ROWS` e a função `FOUND_ROWS()` associada estão desatualizados; espera-se que sejam removidos em uma versão futura do MySQL. Consulte a descrição da `FOUND_ROWS()` para obter informações sobre uma estratégia alternativa.

* Os modificadores `SQL_CACHE` e `SQL_NO_CACHE` eram usados com o cache de consulta antes do MySQL 9.5. O cache de consulta foi removido no MySQL 9.5. O modificador `SQL_CACHE` também foi removido. O `SQL_NO_CACHE` está desatualizado e não tem efeito; espera-se que seja removido em uma futura versão do MySQL.